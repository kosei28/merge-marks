type Mark = {
    type: string;
    start: number;
    end: number;
};

type Segment = {
    text: string;
    marks: string[];
};

function mergeMarks(text: string, marks: Mark[]): Segment[] {
    // 各ポイントにおける修飾の開始終了を記録するためのマップ
    const points: Map<number, { start: string[]; end: string[] }> = new Map();

    // 修飾の開始点と終了点をポイントマップに記録
    marks.forEach((mark) => {
        if (!points.has(mark.start)) {
            points.set(mark.start, { start: [], end: [] });
        }
        points.get(mark.start)!.start.push(mark.type);

        if (!points.has(mark.end)) {
            points.set(mark.end, { start: [], end: [] });
        }
        points.get(mark.end)!.end.push(mark.type);
    });

    // ポイントをソートして順に処理
    const sortedPoints = Array.from(points.keys()).sort((a, b) => a - b);
    const segments: Segment[] = [];
    let currentMarks: Map<string, { count: number }> = new Map();
    let lastIndex = 0;

    sortedPoints.forEach((point) => {
        const { start, end } = points.get(point)!;
        // 前のセグメントを配列に追加
        if (point > lastIndex) {
            segments.push({
                text: text.substring(lastIndex, point),
                marks: Array.from(currentMarks.keys()),
            });
            lastIndex = point;
        }
        // 現在の修飾を更新
        start.forEach((type) => {
            if (!currentMarks.has(type)) {
                currentMarks.set(type, { count: 0 });
            }
            currentMarks.get(type)!.count++;
        });
        end.forEach((type) => {
            currentMarks.get(type)!.count--;
            if (currentMarks.get(type)!.count === 0) {
                currentMarks.delete(type);
            }
        });
    });

    // 最後のセグメントを追加
    if (lastIndex < text.length) {
        segments.push({
            text: text.substring(lastIndex, text.length),
            marks: Array.from(currentMarks.keys()),
        });
    }

    return segments;
}

// 使用例
const text = 'あいうえおかきくけこ';
const marks: Mark[] = [
    { start: 2, end: 6, type: 'bold' },
    { start: 4, end: 8, type: 'italic' },
    { start: 5, end: 7, type: 'bold' },
];

console.log(mergeMarks(text, marks));
/*
出力例:
[
    {
        text: "あい",
        marks: []
    }, {
        text: "うえ",
        marks: [ "bold" ]
    }, {
        text: "お",
        marks: [ "bold", "italic" ]
    }, {
        text: "か",
        marks: [ "bold", "italic" ]
    }, {
        text: "き",
        marks: [ "bold", "italic" ]
    }, {
        text: "く",
        marks: [ "italic" ]
    }, {
        text: "けこ",
        marks: []
    }
]
*/

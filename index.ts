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
    let currentMarks: Set<string> = new Set();
    let lastIndex = 0;

    sortedPoints.forEach((point) => {
        const { start, end } = points.get(point)!;
        // 前のセグメントを配列に追加
        if (point > lastIndex) {
            segments.push({
                text: text.substring(lastIndex, point),
                marks: Array.from(currentMarks),
            });
            lastIndex = point;
        }
        // 現在の修飾を更新
        start.forEach((type) => currentMarks.add(type));
        end.forEach((type) => currentMarks.delete(type));
    });

    // 最後のセグメントを追加
    if (lastIndex < text.length) {
        segments.push({
            text: text.substring(lastIndex, text.length),
            marks: Array.from(currentMarks),
        });
    }

    return segments;
}

// 使用例
const text = 'あいうえおかきくけこ';
const marks: Mark[] = [
    { start: 2, end: 6, type: 'bold' },
    { start: 4, end: 8, type: 'italic' },
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
        text: "おか",
        marks: [ "bold", "italic" ]
    }, {
        text: "きく",
        marks: [ "italic" ]
    }, {
        text: "けこ",
        marks: []
    }
]
*/

import useCard from "./useCard";

export function useBingo() {
  const lines = [];
  const { get_card } = useCard();
  function check_win(n, d, c) {
    const card = get_card([n])[0];

    let line1 = [card.b1, card.b2, card.b3, card.b4, card.b5];
    let line2 = [card.i1, card.i2, card.i3, card.i4, card.i5];
    let line3 = [card.n1, card.n2, card.n4, card.n5];
    let line4 = [card.g1, card.g2, card.g3, card.g4, card.g5];
    let line5 = [card.o1, card.o2, card.o3, card.o4, card.o5];
    let line6 = [card.b1, card.i1, card.n1, card.g1, card.o1];
    let line7 = [card.b2, card.i2, card.n2, card.g2, card.o2];
    let line8 = [card.b3, card.i3, card.g3, card.o3];
    let line9 = [card.b4, card.i4, card.n4, card.g4, card.o4];
    let line10 = [card.b5, card.i5, card.n5, card.g5, card.o5];
    let line11 = [card.b1, card.i2, card.g4, card.o5];
    let line12 = [card.b5, card.i4, card.g2, card.o1];
    let line13 = [card.b1, card.b5, card.o1, card.o5];
    let line14 = [card.b1, card.b2, card.i1, card.i2];
    let line15 = [card.g1, card.g2, card.o1, card.o2];

    const all_lines = [
      line1,
      line2,
      line3,
      line4,
      line5,
      line6,
      line7,
      line8,
      line9,
      line10,
      line11,
      line12,
      line13,
      line14,
      line15,
    ];

    console.log("From useBingo ", n, d, c);

    all_lines.forEach((l) => {
      if (l.every((element) => d.includes(element))) {
        // lineMakingArray.push([...l]);
        for (let i = 0; i < l.length; i++) {
          lines.push(l[i]);
        }
      }
    });

    if (lines.length > 0 && lines.includes(c)) {
      // if (lines.length > 0) {
      // if (0 == 0) {
      console.log("Lines: ", lines);
      return { status: true, data: { lines, card } };
    } else {
      // lines = [];
    }

    return { status: false };
  }

  return { check_win };
}

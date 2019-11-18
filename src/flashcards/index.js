var HSK1 = [],
  HSK2 = [],
  HSK3 = [],
  HSK4 = [],
  HSK5 = [],
  HSK6 = [];

for (var x1 = 1; x1 <= 150; x1++) {
  HSK1.push(x1);
}

for (var x2 = 151; x2 <= 300; x2++) {
  HSK2.push(x2);
}

for (var x3 = 301; x3 <= 599; x3++) {
  HSK3.push(x3);
}

for (var x4 = 600; x4 <= 1200; x4++) {
  HSK4.push(x4);
}

for (var x5 = 1201; x5 <= 2500; x5++) {
  HSK5.push(x5);
}

for (var x6 = 2501; x6 <= 5000; x6++) {
  HSK6.push(x6);
}

export default [
  HSK1,
  HSK2,
  HSK3,
  HSK4,
  HSK5,
  HSK6
]
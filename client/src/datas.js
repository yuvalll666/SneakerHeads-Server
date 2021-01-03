/**
 * Format a Date.now() Object
 * @param {Date} date - Date.now()
 * @returns - Formated date
 */
const getDate = (date) => {
  let newDate = new Date(date);
  let yy = newDate.getFullYear();
  let mm = newDate.getMonth() + 1;
  if (mm < 10) {
    mm = "0" + mm;
  }
  let dd = newDate.getDate();
  if (dd < 10) {
    dd = "0" + dd;
  }
  let hh = newDate.getHours();
  let sec = newDate.getSeconds();
  let min = newDate.getMinutes();

  let formatedDate = `${yy}-${mm}-${dd} ${hh}:${min}:${sec}`;

  return formatedDate ? formatedDate : null;
};

const price = [
  {
    _id: 0,
    name: "Any",
    array: [],
  },
  {
    _id: 1,
    name: "$0 - $199",
    array: [0, 199],
  },
  {
    _id: 2,
    name: "$200 - $399",
    array: [200, 399],
  },
  {
    _id: 3,
    name: "$400 - $599",
    array: [400, 599],
  },
  {
    _id: 4,
    name: "$600 - $799",
    array: [600, 799],
  },
  {
    _id: 5,
    name: "$800 - $999",
    array: [800, 999],
  },
  {
    _id: 6,
    name: "More then $1000",
    array: [1000, 9999],
  },
];

const brands = [
  {
    _id: 1,
    name: "Nike",
  },
  {
    _id: 2,
    name: "Air Jordan",
  },
  {
    _id: 3,
    name: "Adidas",
  },
  {
    _id: 4,
    name: "Yeezy",
  },
  {
    _id: 5,
    name: "Vans",
  },
  {
    _id: 6,
    name: "Converse",
  },
  {
    _id: 7,
    name: "NB",
  },
];

export { price, brands, getDate };

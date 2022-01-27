export function calStartNum(length, currentPage, size) {
  return length > 0 ? ((currentPage - 1) * size + 1) : 0;
}

export function calEndNum(length, currentPage, size) {
  return length > 0 ? (calStartNum(length,currentPage,size) + length - 1 ) : 0;

}

// function calc() {
//   let length = 50, currentPage = 2, size = 50;
//   console.log(calStartNum(length, currentPage, size))
//   console.log(calEndNum(length, currentPage, size))
// }
//
// calc()

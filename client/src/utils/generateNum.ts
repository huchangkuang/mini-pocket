export const randomNum = (start: number, end: number) => (Math.ceil(Math.random() * end) - start + 1)

export const generateNumList = (total = 33, resLength = 6) => {
  const redBallPool = new Array(total).fill("").map((_, index) => index + 1)
  const redResult:number[] = []
  for (let i = 0; i < resLength; i++) {
    const index = randomNum(0, total - i - 1)
    const [item] = redBallPool.splice(index, 1)
    redResult.push(item)
  }
  return redResult.sort((a,  b) => a - b)
}

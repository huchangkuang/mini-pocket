export const randomNum = (num: number) => Math.round(Math.random() * num)

export const generateNumList = (total = 33, resLength = 6) => {
  const redBallPool = new Array(total).fill("").map((_, index) => index + 1)
  const redResult:number[] = []
  for (let i = 0; i < resLength; i++) {
    const index = randomNum(total - i - 1)
    const [item] = redBallPool.splice(index, 1)
    redResult.push(item)
  }
  return redResult.sort((a,  b) => a - b)
}

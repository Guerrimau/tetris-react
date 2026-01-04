export const sortByMod = (a, b) => { 
    if(modX > 0) return b.currentX - a.currentX
    if(modX < 0) return a.currentX - b.currentX
    if(modY > 0) return b.currentY - a.currentY
    if(modY < 0) return a.currentY - b.currentY
    return 1
}
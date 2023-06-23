
const formatFavCount = (favCount: number) => {
    const formatter = Intl.NumberFormat('en', {notation: 'compact'})
    return formatter.format(favCount)
}
export default formatFavCount
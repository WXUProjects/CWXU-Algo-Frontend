/**
 * 生成彩虹渐变格式化的文本
 * 每个字符都有独立的颜色样式，形成左上到右下的彩虹渐变
 * @param inputText - 输入的文本（支持多行）
 * @returns {string, format} - 格式化字符串和样式数组
 */
function generateRainbowText(inputText: string): { string: string, format: string[] } {
    // 将文本分割成行
    const lines = inputText.split('\n')
    if (lines.length === 0) {
        return { string: '', format: [] }
    }
    const maxLineLength = Math.max(...lines.map(line => line.length))

    let formattedString = ''
    const format: string[] = []

    // 遍历每一行和每个字符
    for (let y = 0; y < lines.length; y++) {
        const line = lines[y]
        if (!line) continue // 跳过空行
        for (let x = 0; x < line.length; x++) {
            const char = line[x]

            // 计算对角线位置权重 (0到1之间)
            // 左上角(0,0)权重0，右下角(maxLineLength-1, lines.length-1)权重1
            const xWeight = maxLineLength > 1 ? x / (maxLineLength - 1) : 0
            const yWeight = lines.length > 1 ? y / (lines.length - 1) : 0
            // 对角线权重：从左上到右下的线性插值
            const diagonalWeight = (xWeight + yWeight) / 2

            // 计算HSL颜色，色调从0°(红色)到350°(蓝色)
            const hue = diagonalWeight * 250 // 0-350度，覆盖红到蓝的彩虹色
            const saturation = 100 // 饱和度100%
            const lightness = 40 // 亮度50%

            // 将HSL转换为RGB
            const { r, g, b } = hlsToRgb(hue, lightness, saturation)

            // 添加格式化字符
            formattedString += `%c${char}`
            format.push(`color:rgb(${r},${g},${b})`)
        }
        // 换行符保持默认颜色
        if (y < lines.length - 1) {
            formattedString += `%c\n`
            format.push('color:auto')
        }
    }

    // 最后添加一个%c用于重置样式
    formattedString += '%c'
    format.push('color:auto')

    return { string: formattedString, format }
}

/**
 * 将RGB颜色转换为十六进制颜色代码
 * @param r - 红色值 (0-255)
 * @param g - 绿色值 (0-255)
 * @param b - 蓝色值 (0-255)
 * @returns {string} - 十六进制颜色代码
*/
const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * 将HSL颜色转换为RGB颜色
 * @param hue - 色调 (0-360)
 * @param lightness - 亮度 (0-100)
 * @param saturation - 饱和度 (0-100)
 * @returns {r: number, g: number, b: number} - RGB颜色对象
*/
const hlsToRgb = (hue: number, lightness: number, saturation: number): { r: number, g: number, b: number } => {
    const h = hue / 60
    const s = saturation / 100
    const l = lightness / 100
    const c = (1 - Math.abs(2 * l - 1)) * s
    const xColor = c * (1 - Math.abs(h % 2 - 1))
    const m = l - c / 2

    let r, g, b
    if (h < 1) {
        r = c; g = xColor; b = 0
    } else if (h < 2) {
        r = xColor; g = c; b = 0
    } else if (h < 3) {
        r = 0; g = c; b = xColor
    } else if (h < 4) {
        r = 0; g = xColor; b = c
    } else if (h < 5) {
        r = xColor; g = 0; b = c
    } else {
        r = c; g = 0; b = xColor
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return { r, g, b }
}

export default generateRainbowText
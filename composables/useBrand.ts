export const BRAND = '#0071e3'
export const BRAND_SOFT = '#bcd8fb'
export const OK = '#2fa86a'
export const BAD = '#e0556a'
export const INK = '#1d1d1f'
export const MUTED = '#86868b'
export const NEUTRAL = '#d2d2d7'

export const AXIS_LINE = '#ededf0'
export const SPLIT_LINE = '#f2f2f5'

export const CHART_FONT = "'Onest', -apple-system, BlinkMacSystemFont, sans-serif"
export const CHART_MUTED = '#737373'
export const CHART_TEXT = '#404040'

export const baseTextStyle = {
  fontFamily: CHART_FONT,
  fontWeight: 400,
  color: CHART_TEXT
}

export const chartAxisLabel = {
  color: CHART_MUTED,
  fontWeight: 400,
  fontFamily: CHART_FONT,
  fontSize: 12
}

export const chartCategoryAxisLabel = {
  color: CHART_TEXT,
  fontWeight: 400,
  fontFamily: CHART_FONT,
  fontSize: 12
}

export const chartLegend = {
  bottom: 0,
  icon: 'circle',
  itemWidth: 8,
  itemHeight: 8,
  textStyle: { color: CHART_MUTED, fontWeight: 400, fontFamily: CHART_FONT, fontSize: 12 }
}

export const chartValueAxis = {
  splitLine: { lineStyle: { color: SPLIT_LINE } },
  axisLabel: chartAxisLabel
}

export const chartCategoryAxis = {
  axisLabel: chartCategoryAxisLabel,
  axisLine: { lineStyle: { color: AXIS_LINE } }
}

export const chartBarLabel = {
  fontWeight: 400,
  fontFamily: CHART_FONT,
  fontSize: 12
}

/** [topLeft, topRight, bottomRight, bottomLeft] */
export const BAR_R = {
  stackBottom: [0, 0, 12, 12],
  stackTop: [12, 12, 0, 0],
  horizEnd: [0, 12, 12, 0],
  horizStackStart: [12, 0, 0, 12],
  horizStackEnd: [0, 12, 12, 0],
  horizGrouped: [0, 10, 10, 0]
}

export const baseTooltip = {
  backgroundColor: '#fafafa',
  borderColor: '#f2f2f2',
  borderWidth: 1,
  textStyle: { color: CHART_TEXT, fontSize: 13, fontFamily: CHART_FONT, fontWeight: 400, lineHeight: 20 },
  padding: [12, 16],
  extraCssText: 'box-shadow:0 2px 7px rgba(237,237,237,0.1);border-radius:16px;font-family:Onest,sans-serif;font-weight:400;line-height:1.45;'
}

export function ttHint(text: string) {
  return `<span style="color:${CHART_MUTED};font-size:12px;font-weight:400">${text}</span>`
}

export function ttDivider() {
  return '<hr style="opacity:1;margin:8px 0;border:none;border-top:1px solid #f2f2f2"/>'
}

import {
  grey300,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors'
import {fade} from 'material-ui/utils/colorManipulator'

const theme = {
  palette: {
    primary1Color: '#102027',
    primary2Color: '#62727b',
    primary3Color: grey300,
    accent1Color: '#3d5afe', // indigoA400
    accent2Color: '#8187ff',
    accent3Color: '#0031ca',
    textColor: darkBlack,
    secondaryTextColor: fade(darkBlack, 0.54),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: '#37474f',
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
  toggle: {
    thumbOnColor: '#3d5afe',
    trackOnColor: '#8187ff',
    thumbOffColor: '#9e9e9e',
  }
}

export default theme

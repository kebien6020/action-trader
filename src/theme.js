import {
  grey300,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors'
import {fade} from 'material-ui/utils/colorManipulator'

const theme = {
  palette: {
    primary1Color: '#37474f', // blueGrey800
    primary2Color: '#62727b',
    primary3Color: '#102027',
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
}

export default theme

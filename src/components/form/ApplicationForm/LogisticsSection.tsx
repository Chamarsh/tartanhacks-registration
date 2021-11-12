import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  TextField,
  Typography
} from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import { useTheme } from "@material-ui/styles"
import { Region, ShirtSize } from "enums/Profile"
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState
} from "react"
import { useDispatch } from "react-redux"
import actions from "src/actions"
import isValidPhoneNumber from "src/util/isValidPhoneNumber"
import { LogisticsFields } from "types/ApplicationForm"

const useStyles = makeStyles((theme) => ({
  section: {
    marginTop: "1em",
    display: "flex",
    flexDirection: "column",
    gap: "1em"
  },
  sectionHeader: {
    marginBottom: "1rem"
  }
}))

const LogisticsSection = ({
  validate,
  setValidate,
  setValid
}: {
  validate: boolean
  setValidate: Dispatch<SetStateAction<boolean>>
  setValid: Dispatch<SetStateAction<boolean>>
}): ReactElement => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const classes = useStyles(theme)

  // Logistics information
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("")
  const [shirtSize, setShirtSize] = useState<ShirtSize | null>(null)
  const [wantsHardware, setWantsHardware] = useState<boolean>(false)
  const [address, setAddress] = useState<string>("")
  const [region, setRegion] = useState<Region | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string>("")

  const [phoneNumberErrorStatus, setPhoneNumberErrorStatus] = useState(false)
  const [phoneNumberHelper, setPhoneNumberHelper] = useState("")

  const validateForm = async () => {
    let valid = true
    if (!isValidPhoneNumber(phoneNumber)) {
      valid = false
      setPhoneNumberErrorStatus(true)
      setPhoneNumberHelper("The phone number format you entered is invalid.")
    } else {
      setPhoneNumberErrorStatus(false)
      setPhoneNumberHelper("")
    }

    if (valid) {
      const data: LogisticsFields = {
        dietaryRestrictions,
        shirtSize: shirtSize as ShirtSize,
        wantsHardware,
        address,
        region: region as Region,
        phoneNumber
      }
      await dispatch(actions.application.saveLogistics(data))
    }

    setValid(valid)
    setValidate(false)
  }

  useEffect(() => {
    if (validate) {
      validateForm()
    }
  }, [validate])

  return (
    <div className={classes.section}>
      <Typography variant="h5" className={classes.sectionHeader}>
        LOGISTICS INFORMATION
      </Typography>
      <TextField
        label="Phone Number"
        variant="outlined"
        error={phoneNumberErrorStatus}
        helperText={phoneNumberHelper}
        fullWidth
        required
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value)
        }}
      />
      <TextField
        label="Mailing Address"
        variant="outlined"
        helperText="We use this to send swag if you aren't joining us in-person"
        fullWidth
        multiline
        value={address}
        onChange={(e) => {
          setAddress(e.target.value)
        }}
      />
      <Autocomplete
        options={Object.values(Region)}
        value={region}
        onChange={(e, value) => setRegion(value)}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            {...params}
            label="Home Region"
            helperText="We use this to measure participation analytics from different regions"
            required
          />
        )}
      />
      <TextField
        label="Dietary Restrictions"
        variant="outlined"
        fullWidth
        value={dietaryRestrictions}
        onChange={(e) => {
          setDietaryRestrictions(e.target.value)
        }}
      />
      <Autocomplete
        options={Object.values(ShirtSize)}
        value={shirtSize}
        onChange={(e, value) => setShirtSize(value)}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            {...params}
            label="Shirt Size"
            required
          />
        )}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              value={wantsHardware}
              onChange={(e, checked) => setWantsHardware(checked)}
            />
          }
          label="Will you use hardware?"
        />
      </FormGroup>
    </div>
  )
}

export default LogisticsSection

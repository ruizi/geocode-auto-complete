import { useState } from "react";
import "./styles.css";
import { Col, Container, Row } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import MUIPlacesAutocomplete, {
  geocodeByPlaceID
} from "mui-places-autocomplete";
import * as _ from "lodash";

type AddressComponent = {
  short_name: string;
  long_name: string;
  types: AddressComponentType[];
};

type AddressComponentType =
  | "street_number"
  | "route"
  | "locality"
  | "administrative_area_level_1"
  | "postal_code"
  | "country";

/**
 * https://github.com/Giners/mui-places-autocomplete
 */
export default function App() {
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const findByType = (
    addrObj: AddressComponent[],
    type: AddressComponentType
  ): AddressComponent | undefined => {
    return _.find(addrObj, (o) => {
      return o.types[0] === type;
    });
  };

  const handleSelect = async (e: any) => {
    console.log(e);
    //const [street, city, state, country] = e.description.split(",");
    // Use Geocodes instead of Places object
    const geo = await geocodeByPlaceID(e.place_id);
    const addrObjs = geo[0].address_components;
    const streetNumber = findByType(addrObjs, "street_number");
    const route = findByType(addrObjs, "route");
    const city = findByType(addrObjs, "locality");
    const state = findByType(addrObjs, "administrative_area_level_1");
    const postalCode = findByType(addrObjs, "postal_code");
    const country = findByType(addrObjs, "country");
    setStreet(`${streetNumber?.long_name} ${route?.long_name}`);
    setCity(city?.long_name!);
    setPostalCode(postalCode?.long_name!);
    setState(state?.short_name!);
    setCountry(country?.long_name!);
  };

  const handleChange = async (e) => {
    setStreet(e.target.value);
  };

  const styles = {
    width: "400px"
  };

  return (
    <div className="App">
      <h1>Google Places Autocomplete</h1>
      <h2>Start entering street address.</h2>
      <Container>
        <Row>
          <Col>
            <MUIPlacesAutocomplete
              onSuggestionSelected={handleSelect}
              renderTarget={() => <div />}
              textFieldProps={{
                label: "Street Address",
                type: "Street Address",
                helperText: "",
                style: styles,
                value: street,
                onChange: handleChange
              }}
            />
            <br />
            <TextField
              label="City"
              type="City"
              helperText=""
              value={city}
              style={styles}
            />
            <br />
            <TextField
              label="State"
              type="State"
              helperText=""
              value={state}
              style={styles}
            />
            <br />
            <TextField
              label="Zip"
              type="Zip"
              helperText=""
              value={postalCode}
              style={styles}
            />
            <br />
            <TextField
              label="Country"
              type="Country"
              helperText=""
              value={country}
              style={styles}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

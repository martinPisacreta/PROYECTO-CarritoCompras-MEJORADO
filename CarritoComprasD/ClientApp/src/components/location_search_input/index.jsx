import React,{useEffect} from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { ErrorMessage} from "formik";
import './map.css';
import { usuarioService , alertService} from '../../services';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { usuarioActions } from '../../actions';
import { connect } from 'react-redux';

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.field.name,
      address: this.props.value || "",
      idUsuario: this.props.idUsuario //cargo en id , idUsuario , en caso de que this.props.id sea 0 , es porque el usuario no existe todavia
    };
  }

 
  //se ejecuta despues del render
  componentDidMount() {
    //si entro aca con un usuario que tiene una direccion cargada , hago lo siguiente
    if(this.state.idUsuario > 0) //this.state.id > 0 quiere decir que estoy entrando con un usuario existente
    {
        this.props.getUsuarioById(this.state.idUsuario)
          .then(x => //voy a buscar los datos de ese usuario 
            {
              this.setState({ //seteo el valor del state "address"
                address: x.direccionValor
              });

              const address = this.state.address //creo una constante llamada address, en donde pongo el valor de  this.state.address

              //esta funcion de aca abajo lo que hace es setear el valor del input "location" , con estos datos->
                // value: address,
                // address,
                // coordinates: {
                //   lat: x.lat,
                //   lng: x.lng
                // }
              this.setState(() => {
                this.props.form.setFieldValue(this.state.name, {
                  value: address,
                  address,
                  coordinates: {
                    lat: parseFloat(x.lat),
                    lng: parseFloat(x.lng)
                  }
                });
              });
            })
            .catch(error => {
              alertService.error(error);
            });
      }
  }


  handleError = error => {
    this.props.form.setFieldError(this.state.name, error);
  };

  handleChange = address => {
    this.setState(() => {
      this.props.form.setFieldTouched(`${this.state.name}.value`);
      this.props.form.setFieldTouched(`${this.state.name}.address`);
      this.props.form.setFieldValue(this.state.name, { value: address });

      return { address };
    });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState(() => {
          this.props.form.setFieldValue(this.state.name, {
            value: address,
            address,
            coordinates: latLng
          });
          return { address };
        });
      })
      .catch(error => this.props.form.setFieldError(this.state.name, error));
  };

  //cuando saco el foco del input
  onBlur = () => {
    if(this.state.address === '')
    {
      this.setState(() => {
        this.props.form.setFieldTouched(`${this.state.name}.value`);
        this.props.form.setFieldTouched(`${this.state.name}.address`);
        this.props.form.setFieldValue(this.state.name, { value: '' });
      });
    }
  }

  render() {
    const {
      field: { name, ...field }, // { name, value, onChange, onBlur }
      form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
      classes,
      label,
      ...props
    } = this.props;

    const error = errors[name];
    const touch = touched[name];
    return (
      <PlacesAutocomplete
        name={name}
        id={name}
        {...props}
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onError={this.handleError}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (

          <div>
            
            <input
              { 
                ...getInputProps({
                placeholder: "Buscar dirección ...",
                className: "location-search-input form-control" + (error && touch ? ' is-invalid' : '')
              })}
              onBlur={this.onBlur} //cuando saco el foco del input
              
            />
           
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion,index) => {
                
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                ? { backgroundColor: '#42a5f5', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer'};
                return (
                  <div className="input-suggestion" 
                    {...getSuggestionItemProps(suggestion, {
                      style,
                    })}
                    key = {index}
                  >
                      
                      <LocationOnIcon/> <span>{suggestion.description}</span>
             
                </div>
                );
              })}
            </div>

            {error && error.value && <ErrorMessage name='location.value'  component="div" className="invalid-feedback" />}
            {error && !error.value && error.address && <ErrorMessage name='location.address'  component="div" className="invalid-feedback" />}
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}



const actionCreators = {
  getUsuarioById: usuarioActions.getById,
}

export default connect(null, actionCreators)(LocationSearchInput);

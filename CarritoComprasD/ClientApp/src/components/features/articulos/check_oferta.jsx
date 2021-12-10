import React from 'react';
import Switch from '@material-ui/core/Switch';

function CheckOferta(props) {
   
  
    const handleChange_BotonCambio = (event) => {
      props.handleChange_BotonCambio(event) 
    };
  
    return (
      <div>
        <Switch
          checked={props.sn_checked}
          onChange={handleChange_BotonCambio}
          color="primary"
          name="checkedB"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        /> Ofertas
      </div>
    );
  }

 
  export default CheckOferta;
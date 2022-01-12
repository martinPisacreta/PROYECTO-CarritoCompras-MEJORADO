
import React, { useState, useEffect } from 'react';
import { marcaActions , familiaActions } from '@actions';
import { connect } from 'react-redux';

import {
  TextField,
  Box,
  Switch,
  Autocomplete,
  List,
  ListItem,
  Drawer
} from '@mui/material';
  

import {  makeStyles } from '@mui/styles';
import {alertService} from '@services';


//estilos personalizados del componente
const useStyles = makeStyles({
  textBox: {
        "& .MuiInputBase-root":{
          fontSize: '1.4rem'
        }
     },
  formLabel: {
    "& .MuiFormLabel-root , & .MuiInputBase-input":{
      fontSize: '1.4rem'
    }
  },
  button: {
    display: 'inline-block',
    marginRight: '10px',
    fontSize: '1.4rem'
  } 
});





function MenuFilter(props) {

  const [familias,setFamilias] = useState([]) 
  const [marcaSeleccionadaComboBox, setMarcaSeleccionadaComboBox] = React.useState(null);
  const [familiaSeleccionadaComboBox, setFamiliaSeleccionadaComboBox] = React.useState(null);
  const [codigoArticulo, setCodigoArticulo] = useState("");
  const [descripcionArticulo, setDescripcionArticulo] = useState("");
  const [snOferta, setSnOferta] = useState(false);

  const {
    marcas,  //viene cargado desde articulo-list.jsx
    usuario,

    utilidad,
    setUtilidad,

    page,
    setPage,
    
    filasPerPage,
    loadingDataGrid,
    loadDataGrid,

    //actions
    marcaSelectedHome,
    removeSelectedMarca,
    getIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca
  } = props

//======================================================== USE EFECTS ================================================
  useEffect( () => {
    
     //si viene una marca cargada desde Home , la seteo en el combo
    if(marcaSelectedHome) {
      const _marcaSeleccionadaComboBox = {
        id: marcaSelectedHome.idTablaMarca, 
        label: marcaSelectedHome.txtDescMarca
      }

      //seteo el valor de la marca que viene desde Home
      setMarcaSeleccionadaComboBox(_marcaSeleccionadaComboBox); 
      
      //cargo el dataGrid , llamando a la siguiente funcion
      //1 parametro -> marca que viene desde Home
      //2 parametro -> valor que sirve para setear dentro de la funcion  "setPage"
      //3 parametro -> valor que sirve para indicar que NO accedo a la funcion desde contentMenuFilter
      handleClickLoadDataGrid(_marcaSeleccionadaComboBox,0,0);
    }     
  }, []);


  //se va a llamar cada vez que se actualice "page"
  useEffect( () => {

      //cargo el dataGrid , llamando a la siguiente funcion
      //1 parametro -> marca seleccionada en el combo
      //2 parametro -> valor que sirve para setear dentro de la funcion  "setPage"
      //3 parametro -> valor que sirve para indicar que NO accedo a la funcion desde contentMenuFilter
      handleClickLoadDataGrid(marcaSeleccionadaComboBox,page,0); 
  }, [page]);




//====================================================  COMBOBOX MARCA  =========================================================    
  async function onChangeComboBoxMarca(event,newValue){

    //si newValue no tiene valor , y hay una marca que viene desde Home , remuevo la marca que viene desde Home
    if(newValue === "" && marcaSelectedHome) {
        await removeSelectedMarca();
    }
    await setMarcaSeleccionadaComboBox(newValue); //newValue contiene label y id
    await setFamiliaSeleccionadaComboBox(null);  //cada vez que se modifica el combo marca , se modifica tmb el combo familia
    await loadComboBoxFamilia(newValue); //llamo a la funcion para cargar el combo familia
  }

//====================================================  COMBOBOX FAMILIA  =========================================================      
  async function loadComboBoxFamilia(marca) {
    if(marca) {  //si marca tiene algo escrito ... voy a buscar las familias de esa marca
      await getIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca(marca.id)
      .then(familias => {
        setFamilias(familias)
      })
    }
    else {  //si no tiene nada escrito , limpio el combo familias
      setFamilias([]);
    }
  } 

  async function onChangeComboBoxFamilia(event,newValue){
    await setFamiliaSeleccionadaComboBox(newValue); //newValue contiene label y id
  }
//======================================================== CODIGO ARTICULO ================================================
  function handleChangeCodigoArticulo (e) {
    setCodigoArticulo(e.target.value)
  }
//======================================================== DESCRIPCION ARTICULO ================================================
  function handleChangeDescripcionArticulo (e) {
    setDescripcionArticulo(e.target.value)
  }
//======================================================== UTILIDAD ================================================
  function handleChange_Utilidad(e) {
    let _utilidad = e.target.value;

    if (!Number(_utilidad)) { //si no es numerico sale
        return;
    }

    if(parseInt(_utilidad) > parseInt(100)) { //si supero el maximo , sale
        return;
    }

    if(parseInt(_utilidad) < parseInt(1)) { //si supero el maximo , sale
        _utilidad = 20;
    }       
    setUtilidad(_utilidad);
  }

//======================================================== OFERTA ================================================
  function handleChange_Oferta(event) { 
    let _snOferta = event.target.checked;
    setSnOferta(_snOferta);
  }
//====================================================  MENU FILTERS  =========================================================    
  
  async function handleClickLoadDataGrid(_marcaSeleccionadaComboBox,_page,_accedoDesde_contentMenuFilter) {
    setPage(_page);  //seteo en setPage , el valor de _page

    //si alguno de estos tiene valor , cargo el dataGrid
    if(_marcaSeleccionadaComboBox || familiaSeleccionadaComboBox || codigoArticulo || descripcionArticulo || snOferta) {
      await loadDataGrid(_page,filasPerPage,_marcaSeleccionadaComboBox,familiaSeleccionadaComboBox,codigoArticulo,descripcionArticulo,utilidad,snOferta)
    }
    else { //si ninguno tiene valor , y accedo a la funcion desde contentMenuFilter , muestro mensaje 
      if(_accedoDesde_contentMenuFilter === 1) {
        alertService.error("Seleccione un filtro");
      }
    }
  }

  const [stateContentMenuFilter, setStateContentMenuFilter] = useState({
    busquedaFilter: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setStateContentMenuFilter({...stateContentMenuFilter,[anchor]: open });
  };


 
  const contentMenuFilter = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 400 }}
      role="presentation"
    >
        <List>
          <ListItem >
              <div>
                {/********* Autocomplete MARCA *********/}
                <Autocomplete
                  options={marcas}
                  value={marcaSeleccionadaComboBox}
                  isOptionEqualToValue={(option, value) =>  option.id === value.id }
                  noOptionsText= {"Sin Resultados"}
                  ListboxProps={{
                    sx: { fontSize: '1.4rem' },
                  }}
                  sx={{
                    '& .MuiAutocomplete-input, & .MuiInputLabel-root': {
                      fontSize: '1.4rem',
                      marginRight: '2px'
                    }
                  }}
                  renderInput={(params) => 
                    <TextField  
                      style={{fontSize: '1.4rem' , backgroundColor: 'white' }}  
                      {...params} 
                      label="Marcas" 
                      variant="filled" />}
                  onChange={onChangeComboBoxMarca}
                />
              
                <br/>
              

                {/********* Autocomplete FAMILIA *********/}  
                <Autocomplete
                  options={familias ? familias : null}
                  value={familiaSeleccionadaComboBox}
                  noOptionsText= {"Sin Resultados"}
                  ListboxProps={{
                    sx: { fontSize: '1.4rem' },
                  }}
                  sx={{
                    '& .MuiAutocomplete-input, & .MuiInputLabel-root': {
                      fontSize: '1.4rem',
                      marginRight: '2px'
                    }
                  }}
                  style={{fontSize: '1.4rem' , backgroundColor: 'white' }}  
                  renderInput={(params) => 
                    <TextField  
                      style={{fontSize: '1.4rem' }}  
                      {...params} 
                      label="Familias" 
                      variant="filled" />}
              
                  onChange={onChangeComboBoxFamilia}
                  
                />
              

                <br/>
              

                {/********* TextField CODIGO ARTICULO *********/}
                <TextField
                    fullWidth
                    className={classes.textBox}
                    id="outlined-filterValue"
                    variant="outlined"
                    placeholder="Codigo Articulo"
                    value = {codigoArticulo}
                    inputProps={{
                        maxLength: 50
                      }}
                    style= {{backgroundColor: 'white'}}
                    onChange={(e) => {handleChangeCodigoArticulo(e)}}
                />
              
          
                <br/>
                <br/>

                {/********* TextField DESCRIPCION ARTICULO *********/}
                <TextField
                    fullWidth
                    className={classes.textBox}
                    id="outlined-filterValue"
                    variant="outlined"
                    placeholder="Descripción"
                    value = {descripcionArticulo}
                    inputProps={{
                        maxLength: 50
                      }}
                    style= {{backgroundColor: 'white'}}
                    onChange={(e) => {handleChangeDescripcionArticulo(e)}}
                />


                <br/>
                <br/>

                {/********* TextField UTILIDAD *********/}  
                {usuario &&
                    <TextField
                        className={classes.formLabel}
                        fullWidth
                        id="outlined-utilidad"
                        label= "Utilidad"
                        placeholder="Utilidad"
                        value =  {utilidad}
                        type='number'
                        variant="filled"
                        onChange={(e) => {handleChange_Utilidad(e)}}
                        style= {{backgroundColor: 'white'}}
                    />    
                }

                <br/>
                <br/>

                {/********* Switch OFERTA *********/}  
                <Switch
                    checked={snOferta}
                    onChange={handleChange_Oferta}
                    color="primary"
                    name="checkedB"
                    inputProps={{ 'aria-label': 'primary checkbox' }}  
                /> <span style={{fontSize: '1.4rem'}}>Ofertas </span>


                <br/>
                <br/>




                {/********* button BUSCAR *********/}  
                {/********* MIENTRAS BUSCA , VOY A MOSTRAR UN SPINNER EN EL BOTON *********/}  
                <div className={classes.button}>
                    <button 
                      className="btn btn-success" 

                      //1 parametro -> marca seleccionada en el combo
                      //2 parametro -> valor que sirve para setear dentro de la funcion  "setPage"
                      //3 parametro -> valor que sirve para indicar que SI accedo a la funcion desde contentMenuFilter             
                      onClick={() => handleClickLoadDataGrid(marcaSeleccionadaComboBox,0,1)}
                      disabled={loadingDataGrid}
                    >
                      {loadingDataGrid && <span className="spinner-border spinner-border-sm mr-1"></span>}
                      Buscar
                  </button>
                </div>
                
                {/********* button CLOSE *********/}  
                <div className={classes.button}>
                  <button 
                    type="submit" 
                    className="btn btn-danger" 
                    onClick={toggleDrawer(anchor, false)}
                  >
                        Cerrar
                  </button>
                </div>
              </div>
          </ListItem>
        </List>
                   
    </Box>
  );

  const anchor = "left"
  


//====================================================  STYLE  =========================================================    
  const classes = useStyles();


//====================================================  RENDER  =========================================================      
  return (
    <div>
          <div >

              <div className={classes.button}>
                <button 
                  type="submit" 
                  className="btn btn-success" 
                  onClick={toggleDrawer(anchor, true)} 
                >
                      Busqueda Filtros
                </button>
              </div>
              <Drawer
                anchor={anchor}
                open={stateContentMenuFilter[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                {contentMenuFilter(anchor)}
              </Drawer>
 
          </div>


       
    </div>
  );

}


const mapStateToProps = (state) => {
    return { //cualquier cosa que retorno aca , va a estar disponible como propiedad (props) en nuestro componente
      marcaSelectedHome: state.marcaReducer.marcaSelected ? state.marcaReducer.marcaSelected : null,
    }
  }
  
  
const actionCreators = {
      removeSelectedMarca: marcaActions.removeSelectedMarca,
      getIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca: familiaActions.getIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca
}
    
export default connect(mapStateToProps, actionCreators)(MenuFilter);



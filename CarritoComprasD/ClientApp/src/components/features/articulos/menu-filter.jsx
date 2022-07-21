
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
import {alertService,usuarioService} from '@services';


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
  const [marcaSeleccionadaComboBox, setMarcaSeleccionadaComboBox] = React.useState(null);
  const [familiaSeleccionadaComboBox, setFamiliaSeleccionadaComboBox] = React.useState(null);
  const [codigoArticulo, setCodigoArticulo] = useState("");
  const [descripcionArticulo, setDescripcionArticulo] = useState("");
  const [snOferta, setSnOferta] = useState(false);

  const [marcas,setMarcas] = useState([]) 
  const [familias,setFamilias] = useState([]) 


  const [stateContentMenuFilter, setStateContentMenuFilter] = useState({
    busquedaFilter: false,
  });

  const usuario = usuarioService.usuarioValue;
  



  const {
    prop_utilidad,
    prop_setUtilidad,

    page,
    setPage,
    
    filasPerPage,
    loadingDataGrid,
    loadDataGrid,

    //mapStateToProps
    marcaSelectedHome,

    //actions
    action_removeSelectedMarca,

    action_loadComboBoxMarca,

    action_loadComboBoxFamilia,
    action_loadComboBoxFamiliaByMarca,    
  } = props


//======================================================== TOGGLE DRAWER ==============================================
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setStateContentMenuFilter({...stateContentMenuFilter,[anchor]: open });
  };


//======================================================== USE EFECTS ================================================
  
  async function loadComponentAsync_1() {
    if(marcaSelectedHome) { //si viene una marca cargada desde Home , la seteo en el combo
      const marcaSeleccionadaComboBox = {
        descripcionMarca: marcaSelectedHome.descripcionMarca,
        list_IdTablaMarca: marcaSelectedHome.list_IdTablaMarca
      }

      //seteo el valor de la marca que viene desde Home
      setMarcaSeleccionadaComboBox(marcaSeleccionadaComboBox); 
      
      //llamo a la funcion para cargar el combo familia
      await loadComboBoxFamiliaByMarca(marcaSeleccionadaComboBox);

      //cargo el dataGrid , llamando a la siguiente funcion
      //1 parametro -> marca que viene desde Home
      //2 parametro -> valor que sirve para setear dentro de la funcion  "setPage"
      //3 parametro -> valor que sirve para indicar que NO accedo a la funcion desde contentMenuFilter
      await handleClickLoadDataGrid(marcaSeleccionadaComboBox,0,0);
    }
    else {
      await loadComboBoxMarca();
      await loadComboBoxFamilia();
    }
  }

  useEffect( () => {
    loadComponentAsync_1()     
  }, []);


  async function loadComponentAsync_2(page) {
    //cargo el dataGrid , llamando a la siguiente funcion
    //1 parametro -> marca que viene desde Home (si entro por aca seria NULL)
    //2 parametro -> valor que sirve para setear dentro de la funcion  "setPage"
    //3 parametro -> valor que sirve para indicar que NO accedo a la funcion desde contentMenuFilter
    await handleClickLoadDataGrid(marcaSeleccionadaComboBox,page,0); 
  }

  //se va a llamar cada vez que se actualice "page"
  useEffect( () => {
      loadComponentAsync_2(page);
  }, [page]);




//====================================================  COMBOBOX MARCA  =========================================================    
  async function onChangeComboBoxMarca(event,newValue){
    
    //si newValue no tiene valor , y hay una marca que viene desde Home , remuevo la marca que viene desde Home
    if(newValue === "" && marcaSelectedHome) {
        await action_removeSelectedMarca();
    }
    await setMarcaSeleccionadaComboBox(newValue); //newValue contiene [DescripcionMarca -  List<int> List_IdTablaMarca]
    await setFamiliaSeleccionadaComboBox(null);  //cada vez que se modifica el combo marca , se modifica tmb el combo familia
    
    if(newValue === null) {
      await loadComboBoxFamilia();
    } else {
      await loadComboBoxFamiliaByMarca(newValue); //llamo a la funcion para cargar el combo familia con filtro
    }
  }



  //cargo el combo marca
  async function loadComboBoxMarca() {
    await action_loadComboBoxMarca()
    .then(m => {  
        setMarcas(m);            
    });
  }

//====================================================  COMBOBOX FAMILIA  =========================================================      
  async function onChangeComboBoxFamilia(event,newValue){
    await setFamiliaSeleccionadaComboBox(newValue); //newValue contiene [DescripcionFamilia - IdTablaFamilia]
  }

  async function loadComboBoxFamiliaByMarca(marca) {
    if(marca) {  //si marca tiene algo escrito ... voy a buscar las familias de esa marca
      await action_loadComboBoxFamiliaByMarca(marca) //esta funcion viene de actionCreators
      .then(f => {
        setFamilias(f)
        if(f.length === 1) {
          var newObj = Object.assign({}, ...f ) //convierto array en objeto
          setFamiliaSeleccionadaComboBox(newObj); //newObj contiene [DescripcionMarca -  List<int> List_IdTablaMarca]
        }
      })
    }
  } 

  //cargo el combo familia
  async function loadComboBoxFamilia() {
    await action_loadComboBoxFamilia()
    .then(f => {  
        setFamilias(f);            
    });
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
    let utilidad = e.target.value;

    if (!Number(utilidad)) { //si no es numerico sale
        return;
    }

    if(parseInt(utilidad) > parseInt(100)) { //si supero el maximo , sale
        return;
    }

    if(parseInt(utilidad) < parseInt(1)) { //si supero el maximo , sale
        utilidad = 20;
    }  

    prop_setUtilidad(utilidad);
  }

//======================================================== OFERTA ================================================
  function handleChange_Oferta(event) { 
    let snOferta = event.target.checked;
    setSnOferta(snOferta);
  }

//====================================================  LOAD DATA IN DATAGRID  =========================================================    
  
  async function handleClickLoadDataGrid(marcaSeleccionadaComboBox,page,accedoDesde_contentMenuFilter) {
    setPage(page);  //seteo en setPage , el valor de page

    //si alguno de estos tiene valor , cargo el dataGrid
    if(marcaSeleccionadaComboBox || familiaSeleccionadaComboBox || codigoArticulo || descripcionArticulo || snOferta) {
      await loadDataGrid( 
                          page,
                          filasPerPage,
                          marcaSeleccionadaComboBox,
                          familiaSeleccionadaComboBox,
                          codigoArticulo,
                          descripcionArticulo,
                          prop_utilidad,
                          snOferta
                        )
    }
    else { //si ninguno tiene valor , y accedo a la funcion desde contentMenuFilter , muestro mensaje 
      if(accedoDesde_contentMenuFilter === 1) {
        alertService.error("Seleccione un filtro");
      }
    }
  }

//====================================================  CLEAN UP DATA IN MENU-FILTER  =========================================================    
  
  async function handleClickCleanUpAllMenuFilter() {
    setMarcaSeleccionadaComboBox(null);
    setFamiliaSeleccionadaComboBox(null);
    setCodigoArticulo("");
    setDescripcionArticulo("");
    setSnOferta(false)
  }
  

 
  const contentMenuFilter = (anchor) => (
    <Box
      sx={{ width: 'auto' }}
      role="presentation"
    >
        <List>
          <ListItem >
              <div>
                {/********* Autocomplete MARCA *********/}
                <Autocomplete
                  options={marcas}
                  value={marcaSeleccionadaComboBox}
                  getOptionLabel={(option) => option.descripcionMarca || ""}
                  isOptionEqualToValue={(option, value) =>  option.descripcionMarca === value.descripcionMarca }
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
                  options={familias}
                  value={familiaSeleccionadaComboBox}
                  getOptionLabel={(option) => option.descripcionFamilia || ""}
                  isOptionEqualToValue={(option, value) =>  option.descripcionFamilia === value.descripcionFamilia }
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
                        value =  {prop_utilidad}
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

                 {/********* button LIMPIAR *********/}  
                 <div className={classes.button}>
                    <button 
                      className="btn btn-warning"             
                      onClick={() => handleClickCleanUpAllMenuFilter()}
                    >
                      Limpiar
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
      action_removeSelectedMarca: marcaActions.removeSelectedMarca,
      action_loadComboBoxFamilia: familiaActions.loadComboBoxFamilia,
      action_loadComboBoxMarca: marcaActions.loadComboBoxMarca,
      action_loadComboBoxFamiliaByMarca: familiaActions.loadComboBoxFamiliaByMarca
}
    
export default connect(mapStateToProps, actionCreators)(MenuFilter);



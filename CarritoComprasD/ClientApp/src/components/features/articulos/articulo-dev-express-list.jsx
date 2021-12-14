import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import data from './data.json';
import { articuloActions } from '../../../actions';
import { connect } from 'react-redux';
import {  TextField, IconButton } from '@material-ui/core';

import { SearchOutlined } from '@material-ui/icons';
import { InputAdornment } from '@mui/material';  
import { BackspaceOutlined } from '@material-ui/icons';  
import Grid from '@mui/material/Grid';     
import Box from '@mui/material/Box';
import Switch from '@material-ui/core/Switch';














function ArticuloDevExpresList(props) {

  const {getAllArticulos} = props
  const usuario = JSON.parse(localStorage.getItem('user'));

  const rowsPerPage = 6;
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  
  const [snOferta, setSnOferta] = useState(false);
  const [utilidad,setUtilidad] = useState(usuario ? usuario.utilidad : 20); //seteo la utilidad del usuario
  
  const valueFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  const columns = [

    {
        field : "id",
        hide: true
    },
    {
        field : "marcaArticulo", //va
        headerName: 'Marca',
        type: 'string',
        flex: 1
    },
    { 
        field : "codigoArticulo", //va
        headerName: 'Código',
        type: 'string',
        flex: 1
    },
    {
        field : "descripcionArticulo", //va
        headerName: 'Descripción',
        type: 'string',
        flex: 1
    }, 
    {
        field : "familiaArticulo", //va
        headerName: 'Familia',
        type: 'string',
        flex: 1
    },
    {
        field : "precioListaPorCoeficientePorMedioIva", //va
        headerName: 'Precio Costo',
        type: 'number',
        hide : usuario ? false : true,
        valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
        flex: 1
    },
    {
        field : "utilidadArticulo", //va
        headerName: 'Precio Utilidad',
        type: 'number',
        hide : usuario ? false : true,
        valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
        flex: 1
    },
    {
        field : "snOferta", //va
        type: 'number',
        headerName: 'Oferta',
        flex: 1
    },
    {
        field : "precioListaArticulo",
        type: 'number',
        headerName: 'Precio Lista',
        hide: true
    },
    {
        field : "coeficienteArticulo",
        type: 'number',
        headerName: 'Coeficiente',
        hide: true
    },
    {
        field : "pathImagenArticulo",
        hide: true
    },
    {
        field : "smPathImagenArticulo",
        hide: true
    },  
    {
        field : "stockArticulo",
        hide: true
    },
  ];


  //se va a llamar cada vez que se actualice "page"
  useEffect(() => {
    findDataSet(page,rowsPerPage,utilidad,filterValue,snOferta);
  }, [page]);


  function setPage_o_findDataSet(_page,_rowsPerPage,_utilidad,_filterValue,_snOferta) { 
    if(page == 0) //si la pagina es 0 , voy a llamar directo a findDataSet
      findDataSet(_page,_rowsPerPage,_utilidad,_filterValue,_snOferta)
    else
      setPage(0); //si la pagina no es 0 , seteo la pagina en 0 , y al hacer esto se llama a "useEffect"
  }


  function findDataSet (_page,_rowsPerPage,_utilidad,_filterValue,_snOferta) {
    let active = true;

    (async () => {
      setLoading(true);
      await getAllArticulos(_page,_rowsPerPage,_utilidad,_filterValue,_snOferta)
      .then(newRows => {
        if (!active) {
          return;
        }
  
        setRows(newRows);
        setLoading(false);
      })
      .catch(error => {
        setRows(null);
        setLoading(false);
      })
    })();

    return () => {
      active = false;
    };

}


//======================================================== ADD FILTER ================================================
  function handleChangeFilterValue (e) {
    setFilterValue(e.target.value)
  }

  
  const handleClickSearchFilterValue = () => {
    let _filterValue  = filterValue.toUpperCase();
    setFilterValue(_filterValue);
    setPage_o_findDataSet(page,rowsPerPage,utilidad,_filterValue,snOferta);
  };

//======================================================== DELETE FILTER ================================================

const handleClickBackspaceOutlined = () => {
  let _filterValue  = "";
  setFilterValue(_filterValue);
  setPage_o_findDataSet(page,rowsPerPage,utilidad,_filterValue,snOferta);
};

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

  const handleClickSearchUtilidad = () => {
    findDataSet(page,rowsPerPage,utilidad,filterValue,snOferta)
  };



//======================================================== OFERTA ================================================
  function handleChange_Oferta(event) { 
    let _snOferta = event.target.checked;
    setSnOferta(_snOferta);
 
    setPage_o_findDataSet(page,rowsPerPage,utilidad,filterValue,_snOferta);
  
  }

 


  return (
    <>

  <Box sx={{ width: '100%' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
            <TextField
                fullWidth
                id="outlined-filterValue"
                variant="outlined"
                placeholder="Filtro de Búsqueda"
                value = {filterValue}
                inputProps={{
                    maxLength: 50
                  }}
                InputProps={{
                    endAdornment: (
                        <>
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickSearchFilterValue}> 
                                    <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickBackspaceOutlined}> 
                                    <BackspaceOutlined />
                                </IconButton>
                            </InputAdornment>
                        </>
                      
                    ),
                }}
                onChange={(e) => {handleChangeFilterValue(e)}}
            />
        </Grid>
        <Grid item xs={3}>
            <Switch
                checked={snOferta}
                onChange={handleChange_Oferta}
                color="primary"
                name="checkedB"
                inputProps={{ 'aria-label': 'primary checkbox' }}      
            /> <span>Ofertas </span>
        </Grid>
        <Grid item xs={3}>
            {usuario &&
                  <TextField
                        fullWidth
                        id="outlined-utilidad"
                        label= "Utilidad"
                        placeholder="Utilidad"
                        value =  {utilidad}
                        type='number'
                        variant="outlined"
                        onChange={(e) => {handleChange_Utilidad(e)}}
                        InputProps={{
                          endAdornment: (
                              <>
                                  <InputAdornment position="end">
                                      <IconButton onClick={handleClickSearchUtilidad}> 
                                          <SearchOutlined />
                                      </IconButton>
                                  </InputAdornment>
                              </>
                            
                          ),
                      }}
                  />    
            }
        </Grid>
      </Grid>
    </Box>


    


    <div style={{ height: 400, width: '100%' }}>
       <DataGrid
        rows={rows ? rows.articulos : []}
        columns={columns}
        pagination
        pageSize={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
        rowCount={rows ? rows.total : 0}
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage)}
        loading={loading}
        page={page}
      />
    </div>
    </>
  );

}

const actionCreators = {
    getAllArticulos: articuloActions.getAll
  }
  
  export default connect(null, actionCreators)(ArticuloDevExpresList);
import React, { useState, useEffect } from 'react';
import { DataGrid ,esES } from '@mui/x-data-grid';
import { articuloActions } from '../../../actions';
import { usuarioPedidoActions } from '../../../actions';
import { connect } from 'react-redux';
import {  TextField, IconButton , Grid , Box} from '@material-ui/core';

import { SearchOutlined } from '@material-ui/icons';
import { InputAdornment } from '@mui/material';  
import { BackspaceOutlined } from '@material-ui/icons';  
import Switch from '@material-ui/core/Switch';
import {  makeStyles } from '@material-ui/core/styles';
import DescripcionFila from './descripcion_fila'





const useStyles = makeStyles({
 dataGrid: {
          "&.MuiDataGrid-root":{
            fontSize: '1.4rem'
          },
          "& .MuiTablePagination-displayedRows":{
            fontSize: '1.4rem'
          },
          "& .MuiInputBase-root":{
            fontSize: '1.4rem'
          },
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
          '& .super-app-theme--header': {
            backgroundColor: '#39f',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold'
          }
       },
  textBox: {
        "& .MuiInputBase-root":{
          fontSize: '1.4rem'
        }
     },
  formLabel: {
    "& .MuiFormLabel-root , & .MuiInputBase-input":{
      fontSize: '1.4rem'
    }
  }
});


function ArticuloDevExpresList(props) {

  const {getArticulosByFilters, agregarArticuloPedido , empresa , marcaSelected} = props
  const usuario = JSON.parse(localStorage.getItem('user'));
  const [page, setPage] = useState(0);
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [snOferta, setSnOferta] = useState(false);
  const [utilidad,setUtilidad] = useState(usuario ? usuario.utilidad : 20); //seteo la utilidad del usuario
  const [showArticuloInfo,setShowArticuloInfo] = useState(false);
  const [selectedRowArticulo,setSelectedRowArticulo] = useState('');
  const [cantidad,setCantidad] = useState(1);
  const filasPerPage = 6;
  const [imagenCargada, setImagenCargada] = useState(false);


  //se va a llamar cada vez que se actualice "page"
  useEffect(() => {
    findDataSet(page,filasPerPage,utilidad,filterValue,snOferta);
  }, [page]);

//======================================================== COLUMNAS ================================================
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
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    { 
        field : "codigoArticulo", //va
        headerName: 'Código',
        type: 'string',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    {
        field : "descripcionArticulo", //va
        headerName: 'Descripción',
        type: 'string',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    }, 
    {
        field : "familiaArticulo", //va
        headerName: 'Familia',
        type: 'string',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    {
        field : "precioListaPorCoeficientePorMedioIva", //va
        headerName: 'Precio Costo',
        type: 'number',
        hide : usuario ? false : true,
        valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    {
        field : "utilidadArticulo", //va
        headerName: 'Precio Utilidad',
        type: 'number',
        hide : usuario ? false : true,
        valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    {
        field : "snOferta",
        /*
        type: 'number',
        headerName: 'Oferta',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        */
        hide: true
    },
    {
        field : "pathImagenArticulo",
        hide: true
    },
    {
      field : "codigoArticuloDescripcionArticuloMarcaArticuloFamiliaArticulo",
      hide: true
    },
    {
      field : "precioLista",
      hide: true
    },
    {
      field : "coeficiente",
      hide: true
    },
  ];

//======================================================== DATASET ================================================
  function setPage_o_findDataSet(_page,_filasPerPage,_utilidad,_filterValue,_snOferta) { 
    if(page == 0) //si la pagina es 0 , voy a llamar directo a findDataSet
      findDataSet(_page,_filasPerPage,_utilidad,_filterValue,_snOferta)
    else
      setPage(0); //si la pagina no es 0 , seteo la pagina en 0 , y al hacer esto se llama a "useEffect"
  }


  function findDataSet (_page,_filasPerPage,_utilidad,_filterValue,_snOferta) {
    let active = true;

    (async () => {
      setLoading(true);
      await getArticulosByFilters(_page,_filasPerPage,_utilidad,_filterValue,_snOferta)
      .then(newRows => {
        if (!active) {
          return;
        }
  
        setFilas(newRows);
        setLoading(false);
      })
      .catch(error => {
        setFilas(null);
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
    setPage_o_findDataSet(page,filasPerPage,utilidad,_filterValue,snOferta);
  };

//======================================================== DELETE FILTER ================================================

const handleClickBackspaceOutlined = () => {
  let _filterValue  = "";
  setFilterValue(_filterValue);
  setPage_o_findDataSet(page,filasPerPage,utilidad,_filterValue,snOferta);
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
    findDataSet(page,filasPerPage,utilidad,filterValue,snOferta)
  };



//======================================================== OFERTA ================================================
  function handleChange_Oferta(event) { 
    let _snOferta = event.target.checked;
    setSnOferta(_snOferta);
 
    setPage_o_findDataSet(page,filasPerPage,utilidad,filterValue,_snOferta);
  
  }



//====================================================  ARTICULO  =========================================================    
  function onClick_IconCart(selectedRowsData) //la funcion "onClick_IconCart" es llamada por el Children <DescripcionFila/>
  {
    if ( 0 !== selectedRowsData.stockArticulo )
      agregarArticuloPedido( selectedRowsData, cantidad , usuario.idUsuario , empresa.idEmpresa , utilidad );
  }

  function handleChange_CantidadArticulos(newValue) { //la funcion "handleChange_CantidadArticulos" es llamada por el Children <DescripcionFila/>
    const value = newValue;
    const setValue = value;
    setCantidad(setValue);
  }


//====================================================  STYLE  =========================================================    
  const classes = useStyles();

    
   
    

 


  return (
    <>

  <Box sx={{ width: '100%' }}>
      <Grid container>
        <Grid item xs={6}>
            <TextField
                fullWidth
                className={classes.textBox}
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
                        className={classes.formLabel}
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

    <br/>
    


    <div style={{ height: 400, width: '100%' }}>
       <DataGrid
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        className={classes.dataGrid}
        rows={filas ? filas.articulos : []}
        columns={columns}
        pagination
        pageSize={filasPerPage}
        rowsPerPageOptions={[filasPerPage]}
        rowCount={filas ? filas.total : 0}
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage)}
        loading={loading}
        page={page}
        disableColumnMenu
        onSelectionModelChange={(id) => {
          const selectedID = id;
          const selectedRowData = filas.articulos.filter((row) => row.id === selectedID[0])
          const data = selectedRowData[0];
          setShowArticuloInfo(!!data);
          setSelectedRowArticulo(data);
          setCantidad(1);
          setImagenCargada(false);
      
        }}
      
      />
    </div>

    <br/>
    <br/>

    {
        showArticuloInfo &&
            <DescripcionFila 
                selectedRowArticulo={selectedRowArticulo} //le paso al Children <DescripcionFila/> la funcion selectedRowArticulo
                cantidad = {cantidad} //le paso al Children <DescripcionFila/> la constante cantidad
                setCantidad = {setCantidad} //le paso al Children <DescripcionFila/> la constante setCantidad
                onClick={onClick_IconCart} //le paso al Children <DescripcionFila/> la funcion onClick_IconCart
                onChange={handleChange_CantidadArticulos}  //le paso al Children <DescripcionFila/> la funcion handleChange_CantidadArticulos
                usuario={usuario}
                imagenCargada = {imagenCargada}
                setImagenCargada = {setImagenCargada}
            />
    }

    </>
  );

}


const mapStateToProps = (state) => {
  return { //cualquier cosa que retorno aca , va a estar disponible como propiedad (props) en nuestro componente
    marcaSelected: state.marcaReducer.marcaSelected ? state.marcaReducer.marcaSelected : null,
    empresa: state.empresaReducer.empresa
  }
}


const actionCreators = {
    getArticulosByFilters: articuloActions.getByFilters,
    agregarArticuloPedido: usuarioPedidoActions.agregarArticuloPedido
  }
  
  export default connect(mapStateToProps, actionCreators)(ArticuloDevExpresList);
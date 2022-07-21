import React, { useState} from 'react';
import { DataGrid ,esES } from '@mui/x-data-grid';
import { articuloActions, usuarioPedidoActions , marcaActions} from '@actions';
import { connect } from 'react-redux';

import {  makeStyles } from '@mui/styles';
import DescripcionFila from './descripcion_fila'
import columns from './columns'
import MenuFilter from './menu-filter'
import { usuarioService } from '@services'
import {
  Paper
} from '@mui/material';

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
            color: 'black',
          },
          '& .super-app-theme--header': {
            backgroundColor: '#39f',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold'
          },
          minWidth: 800
       },
  root: {
        width: "100%",
        overflowX: "auto",
        height: 400
      }
});





function ArticuloList(props) {

  const {
          //mapStateToProps
          empresa,

          //actions
          agregarArticuloPedido, 
          getArticulosByFilters,
        } = props


  const usuario = usuarioService.usuarioValue;

//data-grid
  const [page, setPage] = useState(0);
  const [filas, setFilas] = useState(null);
  const [loadingDataGrid, setLoadingDataGrid] = useState(false);
  const filasPerPage = 6;
//data-grid

//menu-filters.jsx
  const [utilidad,setUtilidad] = useState(usuario ? usuario.utilidad : 20); //seteo la utilidad del usuario
//menu-filters.jsx
 
//descripcion-articulo
  const [showArticuloInfo,setShowArticuloInfo] = useState(false);
  const [selectedRowArticulo,setSelectedRowArticulo] = useState('');
  const [cantidad,setCantidad] = useState(1);
  const [imagenCargada, setImagenCargada] = useState(false);
//descripcion-articulo
  


//======================================================== DATAGRID ================================================
  async function loadDataGrid (page,filasPerPage,marcaSeleccionadaComboBox,familiaSeleccionadaComboBox,codigoArticulo,descripcionArticulo,utilidad,snOferta) {
    let active = true;
      (async () => {
        setLoadingDataGrid(true);
        await getArticulosByFilters(page,filasPerPage,marcaSeleccionadaComboBox,familiaSeleccionadaComboBox,codigoArticulo,descripcionArticulo,utilidad,snOferta)
        .then(newRows => {
          if (!active) {
            return;
          }
          setFilas(newRows);
          setLoadingDataGrid(false)
        })
        .catch(() => {
          setFilas(null);
          setLoadingDataGrid(false)
        })
      })();

      return () => {
        active = false;
      };
  }


//====================================================  ADD ARTICULO A PEDIDO =========================================================    
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
    <div>
    <MenuFilter
      prop_utilidad = {utilidad}
      prop_setUtilidad = {setUtilidad}

      page={page}
      setPage = {setPage}

      filasPerPage={filasPerPage}
      loadingDataGrid = {loadingDataGrid}
      loadDataGrid = {loadDataGrid}
      />

    <br/>
    


    <Paper className={classes.root}>
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
          loading={loadingDataGrid}
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
    </Paper>

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

    </div>
  );

}


const mapStateToProps = (state) => {
  return { //cualquier cosa que retorno aca , va a estar disponible como propiedad (props) en nuestro componente
    empresa: state.empresaReducer.empresa
  }
}


const actionCreators = {
    getArticulosByFilters: articuloActions.getByFilters,
    agregarArticuloPedido: usuarioPedidoActions.agregarArticuloPedido,
    loadComboBoxMarca: marcaActions.loadComboBoxMarca
  }
  
  export default connect(mapStateToProps, actionCreators)(ArticuloList);
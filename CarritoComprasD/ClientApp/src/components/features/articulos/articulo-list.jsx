import React, { useState, useEffect } from 'react';
import { DataGrid ,esES } from '@mui/x-data-grid';
import { articuloActions, usuarioPedidoActions , marcaActions} from '../../../actions';
import { connect } from 'react-redux';

import {  makeStyles } from '@material-ui/core/styles';
import DescripcionFila from './descripcion_fila'
import columns from './columns'
import MenuFilter from './menu-filter'


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
          }
       }
});





function ArticuloList(props) {

  const {
          agregarArticuloPedido, 
          empresa,
          getArticulosByFilters,
          getIdTablaMarcaAndTxtDescMarcaWithActive
        } = props


  const usuario = JSON.parse(localStorage.getItem('user'));

//data-grid
  const [page, setPage] = useState(0);
  const [filas, setFilas] = useState([]);
  const [loadingDataGrid, setLoadingDataGrid] = useState(false);
  const filasPerPage = 6;
//data-grid

//menu-filters.jsx
  const [marcas,setMarcas] = useState([]) 
  const [utilidad,setUtilidad] = useState(usuario ? usuario.utilidad : 20); //seteo la utilidad del usuario
//menu-filters.jsx
 
//descripcion-articulo
  const [showArticuloInfo,setShowArticuloInfo] = useState(false);
  const [selectedRowArticulo,setSelectedRowArticulo] = useState('');
  const [cantidad,setCantidad] = useState(1);
  const [imagenCargada, setImagenCargada] = useState(false);
//descripcion-articulo
  


  async function loadComboBoxMarca() {
    //voy a buscar las marcas activas
    await getIdTablaMarcaAndTxtDescMarcaWithActive()
    .then(x => {         
        setMarcas(x);            
    });
  }

  useEffect( () => {
    loadComboBoxMarca();     
  }, []);


//======================================================== DATAGRID ================================================
  async function loadDataGrid (_page,_filasPerPage,_marcaSeleccionadaComboBox,_familiaSeleccionadaComboBox,_codigoArticulo,_descripcionArticulo,_utilidad,_snOferta) {
    let active = true;
      (async () => {
        setLoadingDataGrid(true);
        await getArticulosByFilters(_page,_filasPerPage,_marcaSeleccionadaComboBox,_familiaSeleccionadaComboBox,_codigoArticulo,_descripcionArticulo,_utilidad,_snOferta)
        .then(newRows => {
          if (!active) {
            return;
          }
    
          setFilas(newRows);
          setLoadingDataGrid(false)
        })
        .catch(error => {
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
    <>
   
    <MenuFilter
      marcas = {marcas}
      usuario = {usuario}

      utilidad = {utilidad}
      setUtilidad = {setUtilidad}

      page={page}
      setPage = {setPage}

      filasPerPage={filasPerPage}
      loadingDataGrid = {loadingDataGrid}
   
      loadDataGrid = {loadDataGrid}
      />

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
    empresa: state.empresaReducer.empresa
  }
}


const actionCreators = {
    getArticulosByFilters: articuloActions.getByFilters,
    agregarArticuloPedido: usuarioPedidoActions.agregarArticuloPedido,
    getIdTablaMarcaAndTxtDescMarcaWithActive: marcaActions.getIdTablaMarcaAndTxtDescMarcaWithActive,
    getArticulosByFilters: articuloActions.getByFilters,
  }
  
  export default connect(mapStateToProps, actionCreators)(ArticuloList);
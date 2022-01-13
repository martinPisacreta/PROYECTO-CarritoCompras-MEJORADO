
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { DataGrid ,esES } from '@mui/x-data-grid';
import {  usuarioPedidoActions } from '@actions';
import { connect } from 'react-redux';





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




function PedidoDetalle(props) {

  const {
    idUsuarioPedidoSeleccionado,
    setOpen,
    open,
    getPedidoDetallesByIdUsuarioPedido
  } = props
  
//data-grid
  const [page, setPage] = useState(0);
  const [filas, setFilas] = useState([]);
  const [loadingDataGrid, setLoadingDataGrid] = useState(false);
  const filasPerPage = 6;
//data-grid

  useEffect( () => {
    const payload = {
      idUsuarioPedido: idUsuarioPedidoSeleccionado,
      take: filasPerPage,
      skip : page
    }
  loadDataGrid(payload); 
}, [page]);

  const valueFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  const columns = [
    {
        field : "id", //este campo es el IdUsuarioPedido
        headerName: '#',
        type: 'string',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    { 
        field : "codigoArticulo", //va
        headerName: 'Codigo Articulo',
        type: 'string',
        flex: 2,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    { 
      field : "cantidad", //va
      headerName: 'Cantidad',
      type: 'string',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      sortable: false
    },
    { 
      field : "descripcionArticulo", //va
      headerName: 'Descripcion Articulo',
      type: 'string',
      flex: 3,
      headerClassName: 'super-app-theme--header',
      sortable: false
    },
    { 
      field : "txtDescMarca", //va
      headerName: 'Marca',
      type: 'string',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      sortable: false
    },
    { 
      field : "txtDescFamilia", //va
      headerName: 'Familia',
      type: 'string',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      sortable: false
    },
    {
      field : "precioListaPorCoeficientePorMedioIva", //va
      headerName: 'Precio',
      type: 'number',
      valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
      flex: 1,
      headerClassName: 'super-app-theme--header',
      sortable: false
  },
  ];

  
  const handleClose_Dialog = () => {
    setOpen(false)
  };

  

 

  async function loadDataGrid (payload) {
    let active = true;
      (async () => {
        setLoadingDataGrid(true);
        await getPedidoDetallesByIdUsuarioPedido(payload)
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

  const classes = useStyles();

  return (
    <div>
      <Dialog fullWidth={ true } maxWidth={"md"} onClose={handleClose_Dialog} aria-labelledby="customized-dialog-title" open={open} >
        <DialogTitle id="customized-dialog-title" onClose={handleClose_Dialog}>
          <h3>Pedido Detalle</h3>
        </DialogTitle>
        <DialogContent dividers scrollbarSize={17}>
          <div style={{ height: 400, width: 2000 }}>
              <DataGrid
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                className={classes.dataGrid}
                rows={filas ? filas.usuarioPedidoDetalles : []}
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
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}



const actionCreators = {
  getPedidoDetallesByIdUsuarioPedido: usuarioPedidoActions.getPedidoDetallesByIdUsuarioPedido
}

export default connect(null, actionCreators)(PedidoDetalle);


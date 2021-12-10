import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { esES } from '@material-ui/core/locale';
import PedidoDetalle from './pedido_detalle';
import {alertService , usuarioPedidosService , usuarioService} from '../../../services'

function Pedidos(props) {
  const [pedidos,setPedidos] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const usuario = usuarioService.userValue;

 
  const  columnas = [
    { 
        id: 'id_usuario_pedido', 
        label: '#', 
        minWidth: 170 , 
        visible: 'true'
    },
    { 
        id: 'fecha_pedido', 
        label: 'Fecha', 
        minWidth: 100 , 
        visible: 'true' 
    },
    { 
        id: 'total', 
        label: 'Total', 
        minWidth: 100, 
        visible: 'true'
    }
  ];


 //#region STYLES
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      overflowX: "auto"
    },
    container: {
      maxHeight: 600
    },
    pagination: {
      fontSize: '14px',
    }
  }));
  
  const EstiloCelda = withStyles((theme) => ({
    head: {
      // backgroundColor: theme.palette.common.black,
      // color: theme.palette.common.white,
      color: '#959595',
      fontWeight: 400,
      fontSize: '14px',
      fontFamily: '"Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif'
    },
    body: {
      fontSize: '14px',
      fontFamily: '"Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif'
    },
    footer: {
      fontSize: '14px',
      fontFamily: '"Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif'
    },
  }))(TableCell);


  const EstiloFila = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    hover: {
      "&:hover": {
        backgroundColor: "#949ac9 !important",
        color: " #fff !important",
      },
    },
  }))(TableRow);

  const theme = createMuiTheme({
    typography: {
      body2: {
        fontSize: '14px',
        fontFamily: '"Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif'
      }
    }
  }, esES);
//#endregion STYLES


//#region LLAMADAS PARENT - CHILDREN
const [open, setOpen] = React.useState(false);
const [selectedRow,setSelectedRow] = useState('');
function handleClose_Dialog(newValue) { //la funcion "handleClose_Dialog" es llamada por el Children <PedidoDetalle/>
    setOpen(newValue)
}
//#endregion LLAMADAS PARENT - CHILDREN 


//#region CONSTANTES-FUNCIONES ESTE JSX

  useEffect(() => {
    usuarioPedidosService.getByIdUsuario(usuario.id)
    .then(x => setPedidos(x))
    .catch(error => {
      alertService.error(error);
    });
    }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function seleccionar_row (selectedRowsData) { 
    setOpen(true);
    setSelectedRow(selectedRowsData);
}


//#endregion CONSTANTES-FUNCIONES ESTE JSX




  const classes = useStyles();

  return (

    <>  
    <div className='p5'>
      {
            open &&
            <PedidoDetalle 
                          selectedRow = {selectedRow}
                          handleClose_Dialog = {handleClose_Dialog}
                          open = {open}
            />
      }
        <ThemeProvider theme={theme}>  {/* lo que este dentro de ThemeProvider , va es estar en ESPAÑOL */}
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columnas.map((column) => (
                            column.visible === 'true' &&
                                            <EstiloCelda
                                              key={column.id}
                                              align={column.align}
                                              style={{ minWidth: column.minWidth}}
                                              visible = {column.visible}     
                                            >
                                              {column.label}
                                            </EstiloCelda>
                                          
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        pedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pedido,i) => {
                        return (
                          
                          <EstiloFila  hover role="checkbox" tabIndex={-1} key={i}  >
                            {columnas.map((column) => {
                              const value = pedido[column.id];
                              return (
                                
                                column.visible === 'true' &&
                                                  <EstiloCelda key={column.id} align={column.align} onClick={() => seleccionar_row(pedido)}>
                                                    { 
                                                        value
                                                    }
                                                  </EstiloCelda>
                              );
                            })}
                          </EstiloFila>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              
              <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={pedidos.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  className={classes.pagination}
              />
      </ThemeProvider>

    </div>
  

    </>
  );
}


export default Pedidos;
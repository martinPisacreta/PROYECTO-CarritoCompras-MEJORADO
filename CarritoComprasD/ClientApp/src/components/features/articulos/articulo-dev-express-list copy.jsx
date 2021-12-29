import React, { useState, useEffect,useCallback} from 'react';

import { usuarioService} from '../../../services';
import FormControl from '@material-ui/core/FormControl';
import DescripcionFila from './descripcion_fila.jsx';
import MensajesEnEspaniol from "devextreme/localization/messages/es.json";
import { locale, loadMessages } from "devextreme/localization";
import {  makeStyles } from '@material-ui/core/styles';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Switch from '@material-ui/core/Switch';
import clsx from 'clsx';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import './articulo-dev-express-list.css'

import DataGrid, {
    Column,
    FilterRow,
    Scrolling, 
    Paging, 
    HeaderFilter,
    Sorting
} from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { usuarioPedidoDetalleActions } from '../../../actions/usuarioPedidoDetalle.actions';
import { marcaActions } from '../../../actions/marca.actions';
import { connect } from 'react-redux';




function ArticuloDevExpresList( props ) {
    const {marcaSelected , agregarArticuloPedido} = props
    const [showArticuloInfo,setShowArticuloInfo] = useState(false);
    const [selectedRowArticulo,setSelectedRowArticulo] = useState('');
    const usuario = JSON.parse(localStorage.getItem('user'));



    const [utilidad,setUtilidad] = useState(usuario ? usuario.utilidad : 20); //seteo la utilidad del usuario
    function handleChange_Utilidad(e) {
        let valor = e.target.value;

        if (!Number(valor)) { //si no es numerico sale
            return;
        }

        if(parseInt(valor) > parseInt(100)) { //si supero el maximo , sale
            return;
        }

        if(parseInt(valor) < parseInt(1)) { //si supero el maximo , sale
            valor = 20;
        }       
        setUtilidad(valor)
    }

    const dataSource = createStore({
        key: 'id',
        loadUrl: `articulos/${utilidad}`,
        onBeforeSend: (method, ajaxOptions) => {
          ajaxOptions.xhrFields = { withCredentials: true };
        }
      });

       
    //cargo todo lo relacionado a dev express de este jsx , en español
    loadMessages(MensajesEnEspaniol);
    locale(navigator.language);


    function seleccionar_row ({ selectedRowsData } ) {
        const data = selectedRowsData[0];
        setShowArticuloInfo(!!data);
        setSelectedRowArticulo(data);
        setCantidad(1);
       
    }


   

    const [cantidad,setCantidad] = useState(1);
    function onClick_IconCart(selectedRowsData) //la funcion "onClick_IconCart" es llamada por el Children <DescripcionFila/>
    {
    if ( 0 !== selectedRowsData.stockArticulo )
        agregarArticuloPedido( selectedRowsData, cantidad );
    }
 
    function handleChange_CantidadArticulos(newValue) { //la funcion "handleChange_CantidadArticulos" es llamada por el Children <DescripcionFila/>
    const value = newValue;
    const setValue = value;
    setCantidad(setValue);
    }


    const [sn_checked, setSnChecked] = useState(false);
    function handleChange_BotonCambio(event) { 
        let _sn_checked = event.target.checked;
        setSnChecked(_sn_checked);
    }


    const useStyles = makeStyles((theme) => ({
        margin: {
            margin: theme.spacing(1),
        },
        textField: {
            width: '25ch',
        },
        root: {
            color: red
        }
    }));


    
    const classes = useStyles();
    

    function calculateFilterExpression(value, selectedFilterOperations, target) {   
        if (target === "filterRow") {  

          
            //dataGrid.filter(['descripcionArticulo', '=', value]);
            return [function(dataItem) {  
        
                //esta expresion me ayuda a buscar sin importar el orden de escritura -> "var re = RegExp(`.*${value.toLowerCase().split(' ').join('.*')}.*`)"
                //-> por ejemplo si tengo un campo que dice "H4 PT43 75-70 24V" 
                //-> y yo busco "H4 24V" 
                                        //-> con el filtro normal  no lo encuentra 
                                        //-> con este nuevo si lo encuentra 
                var re = RegExp(`.*${value.toLowerCase().split(' ').join('.*')}.*`)  
        
                if ( dataItem['descripcionArticulo'].toLowerCase().match(re)) {  
                    return true;  
                }  
                else {  
                    return false;  
                }  
            }, "=", true];  
        }  
    }

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      // Add event listener
      window.addEventListener("resize", handleResize);
      // Call handler right away so state gets updated with initial window size
      handleResize();
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }

  //const size = useWindowSize();

 

  return (
    <>
      
      {usuario &&
            <div style={{display : 'inline-block'}}>
                <FormControl className={clsx(classes.margin, classes.textField)}>
                    <InputLabel htmlFor="standard-adornment-password" style={{fontSize: 16}}>Utilidad</InputLabel>
                    <Input
                        id="standard-adornment-utlidad"
                        type='number'
                        value =  {utilidad}
                        onChange={handleChange_Utilidad}
                        inputProps={{
                            style: {fontSize: 15}
                            }}
                    />
                </FormControl>
            </div>
        }

        <br/>
        <br/>

        <Switch
            checked={sn_checked}
            onChange={handleChange_BotonCambio}
            color="primary"
            name="checkedB"
            inputProps={{ 'aria-label': 'primary checkbox' }}      
        /> <span>Ofertas </span>

        <br/>   
        <br/>
        
        <div className='p5'>
                <DataGrid
                    id="gridContainer"
                    dataSource={dataSource}
                    showBorders={true}
                    repaintChangesOnly={true}

                    selection={{ mode: 'single' }}
                    hoverStateEnabled={true}
                    remoteOperations = {true}
                   
                    showColumnLines={true}
                    showRowLines={true}
                    showBorders={true}
                    rowAlternationEnabled={true}
                    onSelectionChanged={seleccionar_row}
                    allowColumnResizing={true}
                    //columnHidingEnabled={true} //esta propiedad me pone "..." al final de la fila si la pantalla es chica y no se ven todas la columnas
                >
            
                    <FilterRow visible={true}  />
                    <HeaderFilter visible={false} />
                    <Sorting mode="multiple"/> {/* or "multiple" | "none" */}
                    <Scrolling mode='virtual'></Scrolling>
                    <Paging defaultPageSize={100} />
                    <Column  
                        dataField="marcaArticulo"  
                        dataType="string" 
                        caption="Marca"  
                        visible={true}  
                        filterValue={marcaSelected  && marcaSelected} //si la marca tiene imagen , muestro el nombre de la imagen , sino muestro el nombre de la marca

                    />
                    <Column 
                        dataField="codigoArticulo" 
                        dataType="string" 
                        caption="Código" 
                        visible={true} 
                    />
                    <Column 
                        dataField="descripcionArticulo" 
                        caption="Descripción"
                        visible={true}
                        //calculateFilterExpression={calculateFilterExpression} 
                        dataType="string"
                    />
                    <Column 
                        dataField="familiaArticulo" 
                        caption="Familia" 
                        dataType="string" 
                        visible={true} 
                    />
                    <Column 
                        editorOptions={{ format: 'currency', showClearButton: true }}
                        dataField="precioListaPorCoeficientePorMedioIva"
                        dataType="number"
                        format="$0#.##"
                        caption="Precio Costo"
                        allowFiltering={false} 
                        width={100} 
                        visible = {usuario ? true : false}
                    /> 
                    <Column 
                        editorOptions={{ format: 'currency', showClearButton: true }}
                        dataField="utilidadArticulo"
                        dataType="number"
                        format="$0#.##"
                        caption="Precio Utilidad"
                        allowFiltering={false} 
                        width={120} 
                        visible = {usuario ? true : false}
                    /> 
                    <Column 
                        dataField="ofertaArticulo" 
                        dataType="number" 
                        caption="Oferta" 
                        visible={true} 
                        width={0} 
                        filterValue={sn_checked ? -1 : 0 } 
                    />
                    <Column 
                        dataField="precioListaArticulo" 
                        dataType="number" 
                        caption="Precio Lista" 
                        visible={false} 
                    />
                    <Column 
                        dataField="Coeficiente" 
                        dataType="number" 
                        caption="coeficienteArticulo"  
                        visible={false} 
                    />
                    
                  

                
                </DataGrid>

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
                        />
                }
        </div>     
    </>
  );
}

const mapStateToProps = (state) => {
    return {
        marcaSelected: state.marcaReducer.marcaSelected ? state.marcaReducer.marcaSelected : null
    }
  }

const actionCreators = {
    getAllMarcas: marcaActions.getAll,
    selectedMarca: marcaActions.selectedMarca,
    agregarArticuloPedido : usuarioPedidoDetalleActions.agregarArticuloPedido
  }

  export default connect(mapStateToProps, actionCreators)(ArticuloDevExpresList);
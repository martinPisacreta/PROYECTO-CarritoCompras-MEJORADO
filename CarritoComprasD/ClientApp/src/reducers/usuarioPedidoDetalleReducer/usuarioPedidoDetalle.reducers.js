import { findIndex } from "../../utils";
import {  usuarioPedidoDetalleConstantes } from '../../actions/types';

const initialState = {
    pedidoDetalle: []
}

export default function usuarioPedidoDetalleDetalleReducers( state = initialState, action ) {
    switch ( action.type ) {
        case usuarioPedidoDetalleConstantes.AGREGAR_ARTICULO_SUCCESS:
            const articuloId = action.payload.articulo.id;

            if ( findIndex( state.pedidoDetalle, articulo => articulo.id === articuloId ) !== -1 ) {
                const v_pedidoDetalle = state.pedidoDetalle.reduce( ( _pedidoDetalle, articulo ) => {
                    if ( articulo.id === articuloId ) {
                        _pedidoDetalle.push( { ...articulo, cantidad: parseInt( articulo.cantidad ) + parseInt( action.payload.cantidad), suma: ( articulo.precioLista_por_coeficiente_por_medioIva ) * ( parseInt( articulo.cantidad ) + parseInt( action.payload.cantidad ) ) } ) // Incrementa cantidad
                    } else {
                        _pedidoDetalle.push( articulo )
                    }
                    return _pedidoDetalle
                }, [] )

                return { ...state,   v_pedidoDetalle }
            }

            return {
                ...state,
                v_pedidoDetalle: [
                    ...state.pedidoDetalle,
                    {
                        ...action.payload.articulo,
                        cantidad: action.payload.cantidad,
                        suma: (  action.payload.articulo.precioLista_por_coeficiente_por_medioIva ) * action.payload.cantidad
                    }
                ]
            }

        case usuarioPedidoDetalleConstantes.ELIMINAR_ARTICULO_SUCCESS:
            return {
                ...state,
                v_pedidoDetalle: state.pedidoDetalle.filter( item => item.id !== action.articuloId )
            };

        case usuarioPedidoDetalleConstantes.CAMBIAR_CANTIDAD_ARTICULO_SUCCESS:
            const v_pedidoDetalle = state.pedidoDetalle.reduce( ( _pedidoDetalle, articulo ) => {
                if ( articulo.id === action.articuloId ) {
                    _pedidoDetalle.push( { ...articulo, cantidad: action.payload.cantidad, suma: (  articulo.precioLista_por_coeficiente_por_medioIva ) * action.payload.cantidad } ) // Increment cantidad
                } else {
                    _pedidoDetalle.push( articulo )
                }
                return _pedidoDetalle;
            }, [] )

            return { ...state, v_pedidoDetalle };
        default:
            return state;
    }
}

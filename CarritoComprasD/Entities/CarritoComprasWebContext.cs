using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace CarritoComprasD.Entities
{
    public partial class CarritoComprasWebContext : DbContext
    {
        public CarritoComprasWebContext()
        {
        }

        public CarritoComprasWebContext(DbContextOptions<CarritoComprasWebContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Articulo> Articulo { get; set; }
        public virtual DbSet<Empresa> Empresa { get; set; }
        public virtual DbSet<Familia> Familia { get; set; }
        public virtual DbSet<LogTareaProgramada> LogTareaProgramada { get; set; }
        public virtual DbSet<Marca> Marca { get; set; }
        public virtual DbSet<RefreshToken> RefreshToken { get; set; }
        public virtual DbSet<Usuario> Usuario { get; set; }
        public virtual DbSet<UsuarioPedido> UsuarioPedido { get; set; }
        public virtual DbSet<UsuarioPedidoDetalle> UsuarioPedidoDetalle { get; set; }
        public virtual DbSet<VArticulo> VArticulo { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=DESKTOP-I7NMOJE;Database=CarritoComprasWeb;Integrated Security=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Articulo>(entity =>
            {
                entity.HasKey(e => e.IdArticulo);

                entity.ToTable("articulo");

                entity.HasIndex(e => e.CodigoArticulo)
                    .HasName("IDX_CODIGO_ARTICULO");

                entity.HasIndex(e => e.CodigoArticuloMarca)
                    .HasName("IDX_CODIGO_ARTICULO_MARCA");

                entity.HasIndex(e => e.DescripcionArticulo)
                    .HasName("IDX_DESCRIPCION_ARTICULO");

                entity.Property(e => e.IdArticulo).HasColumnName("id_articulo");

                entity.Property(e => e.Accion)
                    .HasColumnName("accion")
                    .HasMaxLength(50);

                entity.Property(e => e.CodigoArticulo)
                    .HasColumnName("codigo_articulo")
                    .HasMaxLength(100);

                entity.Property(e => e.CodigoArticuloMarca)
                    .HasColumnName("codigo_articulo_marca")
                    .HasMaxLength(100);

                entity.Property(e => e.DescripcionArticulo)
                    .HasColumnName("descripcion_articulo")
                    .HasMaxLength(400);

                entity.Property(e => e.FecBaja)
                    .HasColumnName("fec_baja")
                    .HasColumnType("datetime");

                entity.Property(e => e.FechaUltModif)
                    .HasColumnName("fecha_ult_modif")
                    .HasColumnType("datetime");

                entity.Property(e => e.IdOrden).HasColumnName("id_orden");

                entity.Property(e => e.IdTablaFamilia).HasColumnName("id_tabla_familia");

                entity.Property(e => e.PathImg)
                    .HasColumnName("path_img")
                    .HasMaxLength(200);

                entity.Property(e => e.PrecioLista)
                    .HasColumnName("precio_lista")
                    .HasColumnType("numeric(18, 4)");

                entity.Property(e => e.SnOferta).HasColumnName("sn_oferta");

                entity.Property(e => e.Stock).HasColumnName("stock");

                entity.HasOne(d => d.IdTablaFamiliaNavigation)
                    .WithMany(p => p.Articulo)
                    .HasForeignKey(d => d.IdTablaFamilia)
                    .HasConstraintName("FK_articulo_familia");
            });

            modelBuilder.Entity<Empresa>(entity =>
            {
                entity.HasKey(e => e.IdEmpresa)
                    .HasName("PK_Empresa");

                entity.ToTable("empresa");

                entity.Property(e => e.IdEmpresa).HasColumnName("id_empresa");

                entity.Property(e => e.Celular)
                    .IsRequired()
                    .HasColumnName("celular")
                    .HasMaxLength(50);

                entity.Property(e => e.Cuit)
                    .IsRequired()
                    .HasColumnName("cuit")
                    .HasMaxLength(15);

                entity.Property(e => e.Direccion)
                    .IsRequired()
                    .HasColumnName("direccion")
                    .HasMaxLength(200);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(50);

                entity.Property(e => e.FechaInicioActividad)
                    .HasColumnName("fecha_inicio_actividad")
                    .HasColumnType("datetime");

                entity.Property(e => e.IdCondicionAnteIva).HasColumnName("id_condicion_ante_iva");

                entity.Property(e => e.NombreFantasia)
                    .IsRequired()
                    .HasColumnName("nombre_fantasia")
                    .HasMaxLength(100);

                entity.Property(e => e.RazonSocial)
                    .IsRequired()
                    .HasColumnName("razon_social")
                    .HasMaxLength(100);

                entity.Property(e => e.Telefono)
                    .IsRequired()
                    .HasColumnName("telefono")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Familia>(entity =>
            {
                entity.HasKey(e => e.IdTablaFamilia);

                entity.ToTable("familia");

                entity.HasIndex(e => e.TxtDescFamilia)
                    .HasName("IDX_TXT_DESC_FAMILIA");

                entity.Property(e => e.IdTablaFamilia)
                    .HasColumnName("id_tabla_familia")
                    .ValueGeneratedNever();

                entity.Property(e => e.Accion)
                    .IsRequired()
                    .HasColumnName("accion")
                    .HasMaxLength(100);

                entity.Property(e => e.Algoritmo1)
                    .HasColumnName("algoritmo_1")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Algoritmo10)
                    .HasColumnName("algoritmo_10")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Algoritmo2)
                    .HasColumnName("algoritmo_2")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Algoritmo3)
                    .HasColumnName("algoritmo_3")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Algoritmo4)
                    .HasColumnName("algoritmo_4")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Algoritmo5)
                    .HasColumnName("algoritmo_5")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Algoritmo6)
                    .HasColumnName("algoritmo_6")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Algoritmo7)
                    .HasColumnName("algoritmo_7")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Algoritmo8)
                    .HasColumnName("algoritmo_8")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Algoritmo9)
                    .HasColumnName("algoritmo_9")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.FecUltModif)
                    .HasColumnName("fec_ult_modif")
                    .HasColumnType("datetime");

                entity.Property(e => e.IdFamilia).HasColumnName("id_familia");

                entity.Property(e => e.IdTablaMarca).HasColumnName("id_tabla_marca");

                entity.Property(e => e.PathImg)
                    .HasColumnName("path_img")
                    .HasMaxLength(500);

                entity.Property(e => e.SnActivo).HasColumnName("sn_activo");

                entity.Property(e => e.TxtDescFamilia)
                    .IsRequired()
                    .HasColumnName("txt_desc_familia")
                    .HasMaxLength(255);

                entity.HasOne(d => d.IdTablaMarcaNavigation)
                    .WithMany(p => p.Familia)
                    .HasForeignKey(d => d.IdTablaMarca)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_familia_marca");
            });

            modelBuilder.Entity<LogTareaProgramada>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("log_tarea_programada");

                entity.Property(e => e.Fecha)
                    .HasColumnName("fecha")
                    .HasColumnType("datetime");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Observacion)
                    .IsRequired()
                    .HasColumnName("observacion")
                    .HasMaxLength(200);

                entity.Property(e => e.Tabla)
                    .IsRequired()
                    .HasColumnName("tabla")
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<Marca>(entity =>
            {
                entity.HasKey(e => e.IdTablaMarca);

                entity.ToTable("marca");

                entity.HasIndex(e => e.PathImg)
                    .HasName("IDX_PATH_IMG");

                entity.Property(e => e.IdTablaMarca)
                    .HasColumnName("id_tabla_marca")
                    .ValueGeneratedNever();

                entity.Property(e => e.Accion)
                    .IsRequired()
                    .HasColumnName("accion")
                    .HasMaxLength(100);

                entity.Property(e => e.FecUltModif)
                    .HasColumnName("fec_ult_modif")
                    .HasColumnType("datetime");

                entity.Property(e => e.IdMarca).HasColumnName("id_marca");

                entity.Property(e => e.IdProveedor).HasColumnName("id_proveedor");

                entity.Property(e => e.PathImg)
                    .HasColumnName("path_img")
                    .HasMaxLength(500);

                entity.Property(e => e.SnActivo).HasColumnName("sn_activo");

                entity.Property(e => e.TxtDescMarca)
                    .IsRequired()
                    .HasColumnName("txt_desc_marca")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.IdRefreshToken);

                entity.ToTable("refresh_token");

                entity.Property(e => e.IdRefreshToken).HasColumnName("id_refresh_token");

                entity.Property(e => e.Created)
                    .HasColumnName("created")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreatedByIp)
                    .IsRequired()
                    .HasColumnName("created_by_ip")
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.Expires)
                    .HasColumnName("expires")
                    .HasColumnType("datetime");

                entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");

                entity.Property(e => e.ReplacedByToken)
                    .HasColumnName("replaced_by_token")
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.Revoked)
                    .HasColumnName("revoked")
                    .HasColumnType("datetime");

                entity.Property(e => e.RevokedByIp)
                    .HasColumnName("revoked_by_ip")
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.Token)
                    .IsRequired()
                    .HasColumnName("token")
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.RefreshToken)
                    .HasForeignKey(d => d.IdUsuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_refresh_token_usuario");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.IdUsuario)
                    .HasName("PK_Usuario_1");

                entity.ToTable("usuario");

                entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");

                entity.Property(e => e.AceptaTerminos).HasColumnName("acepta_terminos");

                entity.Property(e => e.Apellido)
                    .IsRequired()
                    .HasColumnName("apellido")
                    .HasMaxLength(50);

                entity.Property(e => e.Cuit)
                    .IsRequired()
                    .HasColumnName("cuit")
                    .HasMaxLength(50);

                entity.Property(e => e.DireccionDescripcion)
                    .IsRequired()
                    .HasColumnName("direccion_descripcion")
                    .HasMaxLength(200);

                entity.Property(e => e.DireccionValor)
                    .IsRequired()
                    .HasColumnName("direccion_valor")
                    .HasMaxLength(200);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(50);

                entity.Property(e => e.FechaCreacionUsuario)
                    .HasColumnName("fecha_creacion_usuario")
                    .HasColumnType("date")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.FechaUltimaModificacionUsuario)
                    .HasColumnName("fecha_ultima_modificacion_usuario")
                    .HasColumnType("date");

                entity.Property(e => e.Lat)
                    .IsRequired()
                    .HasColumnName("lat")
                    .HasMaxLength(200);

                entity.Property(e => e.Lng)
                    .IsRequired()
                    .HasColumnName("lng")
                    .HasMaxLength(200);

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasColumnName("nombre")
                    .HasMaxLength(50);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .HasMaxLength(200);

                entity.Property(e => e.PasswordReset)
                    .HasColumnName("password_reset")
                    .HasColumnType("datetime");

                entity.Property(e => e.RazonSocial)
                    .IsRequired()
                    .HasColumnName("razon_social")
                    .HasMaxLength(50);

                entity.Property(e => e.Rol)
                    .IsRequired()
                    .HasColumnName("rol")
                    .HasMaxLength(50);

                entity.Property(e => e.Telefono)
                    .IsRequired()
                    .HasColumnName("telefono")
                    .HasMaxLength(50);

                entity.Property(e => e.TokenReseteo)
                    .HasColumnName("token_reseteo")
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.TokenReseteoFechaExpiracion)
                    .HasColumnName("token_reseteo_fecha_expiracion")
                    .HasColumnType("date");

                entity.Property(e => e.TokenVerificacion)
                    .HasColumnName("token_verificacion")
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.Utilidad).HasColumnName("utilidad");

                entity.Property(e => e.Verified)
                    .HasColumnName("verified")
                    .HasColumnType("datetime");
            });

            modelBuilder.Entity<UsuarioPedido>(entity =>
            {
                entity.HasKey(e => e.IdUsuarioPedido);

                entity.ToTable("usuario_pedido");

                entity.Property(e => e.IdUsuarioPedido).HasColumnName("id_usuario_pedido");

                entity.Property(e => e.FechaPedido)
                    .HasColumnName("fecha_pedido")
                    .HasColumnType("datetime");

                entity.Property(e => e.IdEmpresa).HasColumnName("id_empresa");

                entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");

                entity.Property(e => e.SnFinalizado).HasColumnName("sn_finalizado");

                entity.Property(e => e.Total)
                    .HasColumnName("total")
                    .HasColumnType("numeric(18, 2)");

                entity.HasOne(d => d.IdEmpresaNavigation)
                    .WithMany(p => p.UsuarioPedido)
                    .HasForeignKey(d => d.IdEmpresa)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_usuario_pedido_empresa");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.UsuarioPedido)
                    .HasForeignKey(d => d.IdUsuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_usuario_pedido_usuario");
            });

            modelBuilder.Entity<UsuarioPedidoDetalle>(entity =>
            {
                entity.HasKey(e => e.IdUsuarioPedidoDetalle);

                entity.ToTable("usuario_pedido_detalle");

                entity.Property(e => e.IdUsuarioPedidoDetalle).HasColumnName("id_usuario_pedido_detalle");

                entity.Property(e => e.Cantidad).HasColumnName("cantidad");

                entity.Property(e => e.CodigoArticulo)
                    .IsRequired()
                    .HasColumnName("codigo_articulo")
                    .HasMaxLength(100);

                entity.Property(e => e.Coeficiente)
                    .HasColumnName("coeficiente")
                    .HasColumnType("numeric(18, 2)");

                entity.Property(e => e.DescripcionArticulo)
                    .IsRequired()
                    .HasColumnName("descripcion_articulo")
                    .HasMaxLength(400);

                entity.Property(e => e.IdArticulo).HasColumnName("id_articulo");

                entity.Property(e => e.IdUsuarioPedido).HasColumnName("id_usuario_pedido");

                entity.Property(e => e.PrecioLista)
                    .HasColumnName("precio_lista")
                    .HasColumnType("numeric(18, 2)");

                entity.Property(e => e.PrecioListaPorCoeficientePorMedioIva)
                    .HasColumnName("precioLista_por_coeficiente_por_medioIva")
                    .HasColumnType("numeric(18, 2)");

                entity.Property(e => e.SnOferta).HasColumnName("sn_oferta");

                entity.Property(e => e.TxtDescFamilia)
                    .IsRequired()
                    .HasColumnName("txt_desc_familia")
                    .HasMaxLength(255);

                entity.Property(e => e.TxtDescMarca)
                    .IsRequired()
                    .HasColumnName("txt_desc_marca")
                    .HasMaxLength(100);

                entity.Property(e => e.Utilidad).HasColumnName("utilidad");

                entity.HasOne(d => d.IdUsuarioPedidoNavigation)
                    .WithMany(p => p.UsuarioPedidoDetalle)
                    .HasForeignKey(d => d.IdUsuarioPedido)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_usuario_pedido_detalle_usuario_pedido");
            });

            modelBuilder.Entity<VArticulo>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("v_articulo");

                entity.Property(e => e.CodigoArticulo).HasMaxLength(100);

                entity.Property(e => e.CodigoArticuloDescripcionArticuloMarcaArticuloFamiliaArticulo)
                    .HasColumnName("CodigoArticulo_DescripcionArticulo_MarcaArticulo_FamiliaArticulo")
                    .HasMaxLength(1258);

                entity.Property(e => e.DescripcionArticulo).HasMaxLength(400);

                entity.Property(e => e.FamiliaArticulo)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.MarcaArticulo).HasMaxLength(500);

                entity.Property(e => e.PrecioListaPorCoeficientePorMedioIva).HasColumnType("numeric(38, 11)");

                entity.Property(e => e.UtilidadArticulo).HasColumnType("numeric(2, 2)");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CarritoComprasD.Entities;

namespace CarritoComprasD.Controllers
{
    [Controller]
    public abstract class BaseController : ControllerBase
    {
        // returns the current authenticated usuario (null if not logged in)
        public Usuario Usuario => (Usuario)HttpContext.Items["Usuario"];




    }
}

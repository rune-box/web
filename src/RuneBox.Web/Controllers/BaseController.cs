using RuneBox.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace RuneBox.Controllers {
  public class BaseController : Controller {
    private readonly ILogger<HomeController> _logger;

    public BaseController(ILogger<HomeController> logger) {
      _logger = logger;
    }


    [ResponseCache( Duration = 0, Location = ResponseCacheLocation.None, NoStore = true )]
    public IActionResult Error() {
      return View( new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier } );
    }
  }
}
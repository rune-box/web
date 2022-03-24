using Microsoft.AspNetCore.Mvc;

namespace RuneBox.Controllers {
  public class MemeController : Controller {
    public IActionResult Index() {
      return View();
    }

    //[Route( "meme/daosquare-1" )]
    //public ActionResult DAOSquare1() {
    //  return View();
    //}
    
    [Route( "meme/line-text" )]
    public ActionResult LineText() {
      return View();
    }

    [Route( "meme/triangle-text" )]
    public ActionResult TriangleText() {
      return View();
    }

  }
}

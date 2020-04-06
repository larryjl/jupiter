using Microsoft.AspNetCore.Mvc;

namespace Graph_Hopper.Controllers
{
    [Route("/")]
    public class Index : Controller
    {
        // GET
        public string Greeting()
        {
            var greeting = "Welcome to Graph Hopper API";
            return greeting;
        }
    }
}
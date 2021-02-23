using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using netUsrDapper.Data;

namespace netUsrDapper.Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPlansController : ControllerBase
    {
        private readonly IUserPlansProvider userPlansProvider;
        private readonly IUserPlansProcessor userPlansProcessor;


        public UserPlansController(IUserPlansProvider userPlansProvider, IUserPlansProcessor userPlansProcessor) // , IUserPlansProcessor userPlansProcessor
        {
            this.userPlansProvider = userPlansProvider;
            this.userPlansProcessor = userPlansProcessor;
        }
        // GET: api/UserPlans
        [HttpGet]
        public IEnumerable<UserPlans> Get()
        {
            return userPlansProvider.Get();
        }

        // GET: api/UserPlans/2019-10-20
        [HttpGet("{date}", Name = "Get"), Authorize]
        public IEnumerable<UserPlansData> Get(string date)
        {
            return userPlansProvider.Get(date);
        }

        // POST: api/UserPlans
        [HttpPost, Authorize]
        public void Post([FromBody]UserPlans userPlans)
        {
            userPlansProcessor.Create(userPlans);
        }

        // PUT: api/UserPlans
        [HttpPut, Authorize]
        public void Put([FromBody]UserPlans[] userPlans)
        {
            userPlansProcessor.Update(userPlans);
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}"), Authorize]
        public void Delete(int id)
        {
            userPlansProcessor.Delete(id);
        }
    }
}

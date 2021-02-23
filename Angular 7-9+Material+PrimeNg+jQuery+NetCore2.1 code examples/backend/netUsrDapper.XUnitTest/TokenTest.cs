using System;
using System.Linq;
using Xunit;
using netUsrDapper.Service.Controllers;
using netUsrDapper.Data;
using Microsoft.AspNetCore.Mvc;
using Xunit.Abstractions;

namespace netUsrDapper.XUnitTest
{
    public class TokenTest
    {
         private readonly ITestOutputHelper _testOutputHelper;

        public TokenTest(ITestOutputHelper testOutputHelper)
        {
            _testOutputHelper = testOutputHelper;
        }

        [Fact]
        public void Test1()
        {
            var tokenController = new TokenController();
            var result = tokenController.Get();

            var okObjectResult = result as OkObjectResult;
            Assert.NotNull(okObjectResult);

            var tokenObject = okObjectResult.Value as TokenModel;
            Assert.NotNull(tokenObject);
            Assert.IsAssignableFrom<TokenModel>(tokenObject);

            var tokenString = tokenObject.Token;
            Assert.NotNull(tokenString);
            Assert.IsAssignableFrom<string>(tokenString);

        }
    }
}

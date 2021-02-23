using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Dapper;
using System.Text;

namespace netUsrDapper.Data
{
    public class UserPlansProcessor : IUserPlansProcessor
    {

        private readonly string connectionString;

        public UserPlansProcessor(string connectionString)
        {
            this.connectionString = connectionString;
        }

        public void Create(UserPlans userPlans)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Execute("INSERT INTO UsersPlans (StartDate, EndDate, UserId) VALUES (@StartDate, @EndDate, @UserId)",
                    new { userPlans.StartDate, userPlans.EndDate, userPlans.UserId });
            }
        }

        public void Delete(int userPlansId)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Execute("DELETE FROM UsersPlans WHERE Id=@Id",
                    new { Id = userPlansId });
            }
        }

        public void Update(UserPlans[] userPlansArr)
        {

            List<UserPlans> userPlansDataList = new List<UserPlans>() {};

            foreach (UserPlans userPlans in userPlansArr)
            {
                userPlansDataList.Add(new UserPlans() {
                    Id = userPlans.Id,
                    StartDate = userPlans.StartDate,
                    EndDate = userPlans.EndDate,
                    Sun = userPlans.Sun,
                    Mon = userPlans.Mon,
                    Tue = userPlans.Tue,
                    Wed = userPlans.Wed,
                    Thu = userPlans.Thu,
                    Fri = userPlans.Fri,
                    Sat = userPlans.Sat
                });
            }

            var updateString = "UPDATE UsersPlans SET StartDate=@StartDate, EndDate=@EndDate, " +
                "Sun=@Sun, Mon=@Mon, Tue=@Tue, Wed=@Wed, Thu=@Thu, Fri=@Fri, Sat=@Sat " +
                "WHERE Id=@Id";

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Execute(@updateString, userPlansDataList);
            }
        }
    }
}

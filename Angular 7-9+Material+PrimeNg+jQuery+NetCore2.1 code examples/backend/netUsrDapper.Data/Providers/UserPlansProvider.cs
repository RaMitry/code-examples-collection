using System;
using System.Collections.Generic;
using System.Text;
using Dapper;
using System.Data.SqlClient;

namespace netUsrDapper.Data
{
    public class UserPlansProvider : IUserPlansProvider
    {
        private readonly string connectionString;

        public UserPlansProvider(string connectionString)
        {
            this.connectionString = connectionString;
        }

        public IEnumerable<UserPlans> Get()
        {
            IEnumerable<UserPlans> userPlans = null;

            using (var connection = new SqlConnection(connectionString))
            {

                userPlans = connection.Query<UserPlans>("SELECT * FROM UsersPlans");}

            }

            return userPlans;
        }

        public IEnumerable<UserPlansData> Get(string date)
        {
            IEnumerable<UserPlansData> userPlans = null;

            using (var connection = new SqlConnection(connectionString))
            {

                if (date  == "users")
                {
                    var usersPlansDataByDate = "SELECT s.Id, s.StartDate, s.EndDate, " +
                    "s.Sun, s.Mon, s.Tue, s.Wed, s.Thu, s.Fri, s.Sat, " +
                    "u.Name, u.Info " +
                    "FROM UsersPlans s, Users u " +
                    "WHERE s.UserId = u.Id";

                    userPlans = connection.Query<UserPlansData>(
                        usersPlansDataByDate);

                }
                else
                {
                    var usersPlansDataByDate = "SELECT s.Id, s.StartDate, s.EndDate, s.UserId, " +
                    "s.Sun, s.Mon, s.Tue, s.Wed, s.Thu, s.Fri, s.Sat, " +
                    "u.Name, u.Info " +
                    "FROM UsersPlans s, Users u " +
                    "WHERE s.UserId = u.Id AND s.StartDate = @StartDate";

                    userPlans = connection.Query<UserPlansData>(
                        usersPlansDataByDate,
                        new { StartDate = date });
                }


            }

            return userPlans;
        }
    }
}

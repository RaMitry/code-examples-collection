using System;
using System.Collections.Generic;
using System.Text;

namespace netUsrDapper.Data
{
    public interface IUserPlansProvider
    {
        IEnumerable<UserPlans> Get();

        IEnumerable<UserPlansData> Get(string date);
    }
}

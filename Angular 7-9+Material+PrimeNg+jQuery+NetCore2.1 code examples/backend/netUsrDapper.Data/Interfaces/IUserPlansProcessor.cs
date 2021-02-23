using System;
using System.Collections.Generic;
using System.Text;

namespace netUsrDapper.Data
{
    public interface IUserPlansProcessor
    {
        void Create(UserPlans userPlans);

        void Update(UserPlans[] userPlans);

        void Delete(int userPlansId);
    }
}

﻿using System;

namespace ImposterGame.Website.Controllers.Exceptions
{
    public class ApiException : Exception
    {
        public ApiException(string message) : base(message)
        {
        }
    }
}
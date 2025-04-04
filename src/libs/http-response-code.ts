export class HttpResponse {
    public readonly errorName: string;
    public readonly statusCode: number;
    
    constructor(
        statusCode: number,
        errorName: string
    ) {
        this.errorName = errorName;
        this.statusCode = statusCode;
    }

    toString() {
        return `${this.errorName}: (${this.statusCode})`;
    }
}

export class HttpInformational extends HttpResponse {
    static readonly Continue = new HttpInformational(100, "Continue");
    static readonly Processing = new HttpInformational(102, "Processing");
    static readonly EarlyHints = new HttpInformational(103, "EarlyHints");
    static readonly SwitchingProtocols = new HttpInformational(101, "SwitchingProtocols");

    constructor(
        statusCode: number,
        errorName: string
    ) {
        super(statusCode, errorName);
    }
}

export class HttpSuccess extends HttpResponse {
    static readonly OK = new HttpSuccess(200, "OK");
    static readonly IMUsed = new HttpSuccess(226, "IMUsed");
    static readonly Created = new HttpSuccess(201, "Created");
    static readonly Accepted = new HttpSuccess(202, "Accepted");
    static readonly NoContent = new HttpSuccess(204, "NoContent");
    static readonly MultiStatus = new HttpSuccess(207, "MultiStatus");
    static readonly ResetContent = new HttpSuccess(205, "ResetContent");
    static readonly PartialContent = new HttpSuccess(206, "PartialContent");
    static readonly AlreadyReported = new HttpSuccess(208, "AlreadyReported");
    static readonly NonAuthoritativeInformation = new HttpSuccess(203, "NonAuthoritativeInformation");

    constructor(
        statusCode: number,
        errorName: string
    ) {
        super(statusCode, errorName);
    }
}

export class HttpRedirection extends HttpResponse {
    static readonly Found = new HttpRedirection(302, "Found");
    static readonly SeeOther = new HttpRedirection(303, "SeeOther");
    static readonly UseProxy = new HttpRedirection(305, "UseProxy");
    static readonly NotModified = new HttpRedirection(304, "NotModified");
    static readonly MultipleChoices = new HttpRedirection(300, "MultipleChoices");
    static readonly MovedPermanently = new HttpRedirection(301, "MovedPermanently");
    static readonly TemporaryRedirect = new HttpRedirection(307, "TemporaryRedirect");
    static readonly PermanentRedirect = new HttpRedirection(308, "PermanentRedirect");

    constructor(
        statusCode: number,
        errorName: string
    ) {
        super(statusCode, errorName);
    }
}

export class HttpClientError extends HttpResponse {

    constructor(
        statusCode: number,
        errorName: string
    ) {
        super(statusCode, errorName);
    }

    static readonly Gone = new HttpClientError(410, "Gone")
    static readonly Locked = new HttpClientError(423, "Locked")
    static readonly NotFound = new HttpClientError(404, "NotFound")
    static readonly Conflict = new HttpClientError(409, "Conflict")
    static readonly TooEarly = new HttpClientError(425, "TooEarly")
    static readonly Forbidden = new HttpClientError(403, "Forbidden")
    static readonly BadRequest = new HttpClientError(400, "BadRequest")
    static readonly URITooLong = new HttpClientError(414, "URITooLong")
    static readonly IAmATeapot = new HttpClientError(418, "IAmATeapot")
    static readonly Unauthorized = new HttpClientError(401, "Unauthorized")
    static readonly NotAcceptable = new HttpClientError(406, "NotAcceptable")
    static readonly RequestTimeout = new HttpClientError(408, "RequestTimeout")
    static readonly LengthRequired = new HttpClientError(411, "LengthRequired")
    static readonly PaymentRequired = new HttpClientError(402, "PaymentRequired")
    static readonly PayloadTooLarge = new HttpClientError(413, "PayloadTooLarge")
    static readonly TooManyRequests = new HttpClientError(429, "TooManyRequests")
    static readonly UpgradeRequired = new HttpClientError(426, "UpgradeRequired")
    static readonly MethodNotAllowed = new HttpClientError(405, "MethodNotAllowed")
    static readonly FailedDependency = new HttpClientError(424, "FailedDependency")
    static readonly ExpectationFailed = new HttpClientError(417, "ExpectationFailed")
    static readonly PreconditionFailed = new HttpClientError(412, "PreconditionFailed")
    static readonly MisdirectedRequest = new HttpClientError(421, "MisdirectedRequest")
    static readonly RangeNotSatisfiable = new HttpClientError(416, "RangeNotSatisfiable")
    static readonly UnprocessableEntity = new HttpClientError(422, "UnprocessableEntity")
    static readonly UnsupportedMediaType = new HttpClientError(415, "UnsupportedMediaType")
    static readonly PreconditionRequired = new HttpClientError(428, "PreconditionRequired")
    static readonly UnavailableForLegalReasons = new HttpClientError(451, "UnavailableForLegalReasons")
    static readonly RequestHeaderFieldsTooLarge = new HttpClientError(431, "RequestHeaderFieldsTooLarge")
    static readonly ProxyAuthenticationRequired = new HttpClientError(407, "ProxyAuthenticationRequired")

}

export class HttpServerError extends HttpResponse {
    
    constructor(
        statusCode: number,
        errorName: string
    ) {
        super(statusCode, errorName);
    }

    static readonly BadGateway = new HttpServerError(502, "BadGateway");
    static readonly NotExtended = new HttpServerError(510, "NotExtended");
    static readonly LoopDetected = new HttpServerError(508, "LoopDetected");
    static readonly GatewayTimeout = new HttpServerError(504, "GatewayTimeout");
    static readonly NotImplemented = new HttpServerError(501, "NotImplemented");
    static readonly ServiceUnavailable = new HttpServerError(503, "ServiceUnavailable");
    static readonly InternalServerError = new HttpServerError(500, "InternalServerError");
    static readonly InsufficientStorage = new HttpServerError(507, "InsufficientStorage");
    static readonly VariantAlsoNegotiates = new HttpServerError(506, "VariantAlsoNegotiates");
    static readonly HTTPVersionNotSupported = new HttpServerError(505, "HTTPVersionNotSupported");
    static readonly NetworkAuthenticationRequired = new HttpServerError(511, "NetworkAuthenticationRequired");
}

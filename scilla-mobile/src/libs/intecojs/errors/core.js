// @flow
export class ExtendableError extends Error {
  constructor(message: string = '') {
    super(message);

    // extending Error is weird and does not propagate `message`
    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable : false,
      value : message,
      writable : true,
    });

    Object.defineProperty(this, 'name', {
      configurable: true,
      enumerable : false,
      value : this.constructor.name,
      writable : true,
    });

    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, this.constructor);
      return;
    }

    Object.defineProperty(this, 'stack', {
      configurable: true,
      enumerable : false,
      value : (new Error(message)).stack,
      writable : true,
    });
  }
}

export class NotImplementedError extends ExtendableError {
  constructor(message: string = "Method not implemented.") {
    super(message);
  }
}

export class NotExistError extends ExtendableError {
  constructor(message: string = "Data does nto exist.") {
    super(message);
  }
}

export class PermissionDeniedError extends ExtendableError {
  constructor(message: string = "Missing or insufficient permissions.") {
    super(message);
  }
}
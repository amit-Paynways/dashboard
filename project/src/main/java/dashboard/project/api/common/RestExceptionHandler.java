package dashboard.project.api.common;

import jakarta.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionHandler {
  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ApiError> notFound(NotFoundException ex, HttpServletRequest request) {
    return ResponseEntity
      .status(HttpStatus.NOT_FOUND)
      .body(ApiError.of(404, "Not Found", ex.getMessage(), request.getRequestURI(), Map.of()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex, HttpServletRequest request) {
    Map<String, Object> details = new LinkedHashMap<>();
    Map<String, String> fields = new LinkedHashMap<>();
    for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
      fields.put(fe.getField(), fe.getDefaultMessage());
    }
    details.put("fields", fields);
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(ApiError.of(400, "Validation Error", "Invalid request", request.getRequestURI(), details));
  }
}


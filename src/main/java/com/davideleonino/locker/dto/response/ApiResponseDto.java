// ApiResponseDto.java
package com.davideleonino.locker.dto.response;

public class ApiResponseDto {

    private boolean success;
    private String message;
    private Object data;

    public ApiResponseDto() {}

    public ApiResponseDto(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Object getData() { return data; }

    public void setSuccess(boolean success) { this.success = success; }
    public void setMessage(String message) { this.message = message; }
    public void setData(Object data) { this.data = data; }
}

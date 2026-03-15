// 일관성 있는 응답
export class ApiResponse<T = any> {
    message: string;
    data?: T

    // 초기화 생성자
    constructor(message: string, data?: T){
        this.message = message;
        this.data = data;
    }
}


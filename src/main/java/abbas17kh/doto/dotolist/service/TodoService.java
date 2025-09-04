package abbas17kh.doto.dotolist.service;

import abbas17kh.doto.dotolist.dto.TodoRequest;
import abbas17kh.doto.dotolist.dto.TodoResponse;
import java.util.List;

public interface TodoService {

    List<TodoResponse> getAllTodos();

    TodoResponse getTodoById(Long id);

    TodoResponse createTodo(TodoRequest todoRequest);

    TodoResponse updateTodo(Long id, TodoRequest todoRequest);

    TodoResponse toggleTodoCompletion(Long id);

    void deleteTodo(Long id);

    List<TodoResponse> getCompletedTodos();

    List<TodoResponse> getPendingTodos();

    List<TodoResponse> searchTodos(String keyword);
}
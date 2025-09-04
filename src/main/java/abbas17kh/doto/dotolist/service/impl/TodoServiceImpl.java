package abbas17kh.doto.dotolist.service.impl;

import abbas17kh.doto.dotolist.dto.TodoRequest;
import abbas17kh.doto.dotolist.dto.TodoResponse;
import abbas17kh.doto.dotolist.entity.Todo;
import abbas17kh.doto.dotolist.exception.TodoNotFoundException;
import abbas17kh.doto.dotolist.repository.TodoRepository;
import abbas17kh.doto.dotolist.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    @Autowired
    public TodoServiceImpl(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    public List<TodoResponse> getAllTodos() {
        return todoRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public TodoResponse getTodoById(Long id) {
        Todo todo = findTodoByIdOrThrow(id);
        return new TodoResponse(todo);
    }

    @Override
    public TodoResponse createTodo(TodoRequest todoRequest) {
        Todo todo = new Todo(todoRequest.getTitle(), todoRequest.getDescription());
        Todo savedTodo = todoRepository.save(todo);
        return new TodoResponse(savedTodo);
    }

    @Override
    public TodoResponse updateTodo(Long id, TodoRequest todoRequest) {
        Todo todo = findTodoByIdOrThrow(id);
        todo.setTitle(todoRequest.getTitle());
        todo.setDescription(todoRequest.getDescription());
        Todo updatedTodo = todoRepository.save(todo);
        return new TodoResponse(updatedTodo);
    }

    @Override
    public TodoResponse toggleTodoCompletion(Long id) {
        Todo todo = findTodoByIdOrThrow(id);
        todo.setCompleted(!todo.getCompleted());
        Todo updatedTodo = todoRepository.save(todo);
        return new TodoResponse(updatedTodo);
    }

    @Override
    public void deleteTodo(Long id) {
        Todo todo = findTodoByIdOrThrow(id);
        todoRepository.delete(todo);
    }

    @Override
    public List<TodoResponse> getCompletedTodos() {
        return todoRepository.findByCompletedOrderByCreatedAtDesc(true)
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<TodoResponse> getPendingTodos() {
        return todoRepository.findByCompletedOrderByCreatedAtDesc(false)
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<TodoResponse> searchTodos(String keyword) {
        return todoRepository.findByKeyword(keyword)
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }

    private Todo findTodoByIdOrThrow(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException("Todo not found with id: " + id));
    }
}
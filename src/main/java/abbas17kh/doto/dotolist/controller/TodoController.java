package abbas17kh.doto.dotolist.controller;

import abbas17kh.doto.dotolist.dto.TodoRequest;
import abbas17kh.doto.dotolist.dto.TodoResponse;
import abbas17kh.doto.dotolist.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*")
public class TodoController {

    private final TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public ResponseEntity<List<TodoResponse>> getAllTodos() {
        List<TodoResponse> todos = todoService.getAllTodos();
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getTodoById(@PathVariable Long id) {
        TodoResponse todo = todoService.getTodoById(id);
        return ResponseEntity.ok(todo);
    }

    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(@Valid @RequestBody TodoRequest todoRequest) {
        TodoResponse createdTodo = todoService.createTodo(todoRequest);
        return new ResponseEntity<>(createdTodo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(@PathVariable Long id, @Valid @RequestBody TodoRequest todoRequest) {
        TodoResponse updatedTodo = todoService.updateTodo(id, todoRequest);
        return ResponseEntity.ok(updatedTodo);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TodoResponse> toggleTodoCompletion(@PathVariable Long id) {
        TodoResponse updatedTodo = todoService.toggleTodoCompletion(id);
        return ResponseEntity.ok(updatedTodo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/completed")
    public ResponseEntity<List<TodoResponse>> getCompletedTodos() {
        List<TodoResponse> completedTodos = todoService.getCompletedTodos();
        return ResponseEntity.ok(completedTodos);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<TodoResponse>> getPendingTodos() {
        List<TodoResponse> pendingTodos = todoService.getPendingTodos();
        return ResponseEntity.ok(pendingTodos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TodoResponse>> searchTodos(@RequestParam String keyword) {
        List<TodoResponse> searchResults = todoService.searchTodos(keyword);
        return ResponseEntity.ok(searchResults);
    }
}
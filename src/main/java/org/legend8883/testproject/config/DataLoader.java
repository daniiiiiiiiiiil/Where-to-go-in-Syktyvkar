package org.legend8883.testproject.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.legend8883.testproject.entity.Category;
import org.legend8883.testproject.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    private final CategoryRepository categoryRepository;
    private final ObjectMapper objectMapper;

    private static final List<Category> DEFAULT_CATEGORIES = Arrays.asList(
            new Category("Еда", "🍔", "#FF6B6B"),
            new Category("Транспорт", "🚗", "#4ECDC4"),
            new Category("Кафе", "☕", "#FFD166"),
            new Category("Развлечения", "🎬", "#6A0572"),
            new Category("Покупки", "🛍️", "#118AB2"),
            new Category("Здоровье", "💊", "#06D6A0"),
            new Category("Образование", "📚", "#EF476F"),
            new Category("Прочее", "📦", "#073B4C")
    );

    @Transactional
    @Override
    public void run(String... args) throws Exception {
        log.info("Loading categories...");

        try {
            List<Category> categories = loadCategories();

            if (categories != null && !categories.isEmpty()) {
                updateCategories(categories);
                log.info("Categories loaded successfully from JSON");
            } else {
                log.warn("Categories are not loaded, default categories are created");
                createDefaultCategories();
            }
        } catch (Exception e) {
            log.error("Category loading error: {}", e.getMessage());
            log.info("Creating default categories");
            createDefaultCategories();
        }

        log.info("Loading of categories is finished");
    }

    private List<Category> loadCategories() {
        try {
            InputStream inputStream = getClass().getResourceAsStream("/categories.json");

            if (inputStream == null) {
                log.info("categories.json not found, creating file");
                createCategoriesFile();
                inputStream = getClass().getResourceAsStream("/categories.json");

                if (inputStream == null) {
                    log.error("Failed to create a file categories.json");
                    return null;
                }
            }
            List<Category> categories = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<Category>>() {
                    });

            log.info("Loaded {} categories from JSON", categories.size());
            return categories;
        } catch (IOException e) {
            log.error("Category loading error", e);
            return null;
        }
    }

    private void createCategoriesFile() {
        try {
            Path path = Paths.get("src/main/resources/categories.json");
            Files.createDirectories(path.getParent());

            String json = objectMapper.writerWithDefaultPrettyPrinter()
                    .writeValueAsString(DEFAULT_CATEGORIES);
            Files.writeString(path, json);
            log.info("File categories.json has been created");
        } catch (Exception e) {
            log.error("Failed to create a file: {}", e.getMessage());
        }
    }

    private void updateCategories(List<Category> newCategories) {
        if (newCategories == null || newCategories.isEmpty()) {
            return;
        }

        List<Category> existing = categoryRepository.findByUserIsNull();

        for (Category newCategory : newCategories) {
            Optional<Category> existingOpt = existing.stream()
                    .filter(category -> category.getName().equals(newCategory.getName()))
                    .findFirst();

            if(existingOpt.isPresent()) {
                updateCategory(existingOpt.get(), newCategory);
            } else {
                addCategory(newCategory);
            }
        }
    }

    private void updateCategory(Category existing, Category newData) {
        boolean changed = false;

        if (!newData.getIcon().equals(existing.getIcon())) {
            existing.setIcon(newData.getIcon());
            changed = true;
        }

        if (!newData.getColor().equals(existing.getColor())) {
            existing.setColor(newData.getColor());
            changed = true;
        }

        if (changed) {
            categoryRepository.save(existing);
            log.debug("Updated category: {}", existing.getName());
        }
    }

    private void createDefaultCategories() {
        List<Category> existing = categoryRepository.findByUserIsNull();

        for (Category defaultCategory : DEFAULT_CATEGORIES) {
            boolean exists = existing.stream()
                    .anyMatch(category -> category.getName().equals(defaultCategory.getName()));

            if (!exists) {
                addCategory(defaultCategory);
            }
        }

        if (existing.isEmpty()) {
            log.info("Database was empty, adding all default categories");
            DEFAULT_CATEGORIES.forEach(this::addCategory);
        }
    }

    private void addCategory(Category category) {
        category.setUser(null);
        categoryRepository.save(category);
        log.debug("Added category: {}", category.getName());
    }
}

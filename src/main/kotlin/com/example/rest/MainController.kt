package com.example.rest

import com.example.services.DetectedClass
import com.example.services.ObjectDetectionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.multipart.MultipartFile

@Controller
class MainController {

    @Autowired
    lateinit var objectDetectionService: ObjectDetectionService

    @GetMapping("/")
    fun start(): String {
        return "index.html"
    }

    @ResponseBody
    @PostMapping("/detectObjects")
    fun detectObjects(@RequestParam("file") file: MultipartFile): List<DetectedClass> {
        return objectDetectionService.detectObjects(file)
    }
}
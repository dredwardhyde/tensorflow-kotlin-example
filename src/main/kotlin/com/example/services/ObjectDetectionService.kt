package com.example.services

import com.example.utils.LabelUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.env.Environment
import org.springframework.stereotype.Service
import org.springframework.util.ResourceUtils
import org.springframework.web.multipart.MultipartFile
import org.tensorflow.SavedModelBundle
import org.tensorflow.Tensor
import org.tensorflow.ndarray.Shape
import org.tensorflow.ndarray.buffer.DataBuffers
import org.tensorflow.types.TUint8
import java.awt.image.BufferedImage
import java.awt.image.DataBufferByte
import javax.annotation.PostConstruct
import javax.imageio.ImageIO

data class DetectedClass(val name: String, val score: Float)

@Service
class ObjectDetectionService {
    private lateinit var savedModel: SavedModelBundle

    @Autowired
    private lateinit var env: Environment

    private fun bgr2rgb(data: ByteArray) {
        var i = 0
        while (i < data.size) {
            val tmp = data[i]
            data[i] = data[i + 2]
            data[i + 2] = tmp
            i += 3
        }
    }

    @PostConstruct
    fun init() {
        savedModel = SavedModelBundle.loader(ResourceUtils.getFile(env.getRequiredProperty("model.directory")).absolutePath).withTags("serve").load()
    }

    private fun createTensor(img: BufferedImage): TUint8 {
        val bgr = BufferedImage(img.width, img.height, BufferedImage.TYPE_3BYTE_BGR).also { it.graphics.drawImage(img, 0, 0, null) }
        val data = (bgr.data.dataBuffer as DataBufferByte).data
        bgr2rgb(data)
        return Tensor.of(TUint8::class.java, Shape.of(1, bgr.height.toLong(), bgr.width.toLong(), 3), DataBuffers.of(data, true, false))
    }

    private fun getInputNodeName(model: SavedModelBundle, name: String): String {
        val sig = model.metaGraphDef().getSignatureDefOrThrow("serving_default")
        return sig.inputsMap.filterKeys { it == name }.values.first().name
    }

    private fun getOutputNodeName(model: SavedModelBundle, name: String): String {
        val sig = model.metaGraphDef().getSignatureDefOrThrow("serving_default")
        return sig.outputsMap.filterKeys { it == name }.values.first().name
    }

    @Throws(Exception::class)
    fun detectObjects(file: MultipartFile): List<DetectedClass> {
        val testImage = ImageIO.read(file.getInputStream())
        val input = createTensor(testImage)
        val outputs = savedModel
                .session()
                .runner()
                .feed(getInputNodeName(savedModel, "input_tensor"), input)
                .fetch(getOutputNodeName(savedModel, "num_detections"))
                .fetch(getOutputNodeName(savedModel, "detection_scores"))
                .fetch(getOutputNodeName(savedModel, "detection_classes"))
                .run()
        val labels = LabelUtils.loadLabels(ResourceUtils.getFile(env.getRequiredProperty("model.directory") + "/mscoco_label_map.pbtxt").absolutePath)
        val results = mutableListOf<DetectedClass>()
        outputs[0].use { detectionsT ->
            outputs[1].use { scoresT ->
                outputs[2].use { classesT ->
                    for (i in 0 until detectionsT.asRawTensor().data().asFloats().getFloat(0).toInt()) {
                        val label = labels[classesT.asRawTensor().data().asFloats().getFloat(i.toLong()).toInt()]
                        if (label != null) {
                            results.add(DetectedClass(label, scoresT.asRawTensor().data().asFloats().getFloat(i.toLong())))
                        }
                    }
                }
            }
        }
        return results
    }
}
package main

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoUri string = "mongodb://localhost:27017"
var mongoDbName string = "taskmanager"
var mongoCollectionTask string ="tasks"
var taskCollection *mongo.Collection

type Task struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title string `bson:"title" json:"title"`
	Status string `bson:"status" json:"status"`
}

func main() {
	connectDB()

	r := gin.Default()
	r.Use(cors.Default())

	r.POST("/tasks",createTask)
	r.GET("/tasks",getTasks)
	r.GET("/tasks/:id",getTaskByID)
	r.PUT("/tasks/:id",updateTask)
	r.DELETE("/tasks/:id",deleteTask)

	r.Run(":8080")
}

func connectDB() {
    client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoUri))
    if err != nil {
        log.Fatal("MongoDB Connection Error: ", err)
    }

    // Check MongoDB connection
    err = client.Ping(context.TODO(), nil)
    if err != nil {
        log.Fatal("Failed to ping MongoDB: ", err)
    }

    // Assign the collection
    db := client.Database(mongoDbName)
    taskCollection = db.Collection(mongoCollectionTask)

    // Check if collection exists, and create if not
    err = db.CreateCollection(context.TODO(), mongoCollectionTask)
    if err != nil && !mongo.IsDuplicateKeyError(err) {
        log.Println("Collection already exists or could not be created:", err)
    }

    log.Println("Connected to MongoDB")
}


func getTasks(c *gin.Context) {
	cursor, err := taskCollection.Find(context.TODO(),bson.M{})
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"Failed to fetch tasks"})
		return
	}
	defer cursor.Close(context.TODO())

	var tasks []Task
	if err = cursor.All(context.TODO(), &tasks); err !=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"Failed to parse tasks"})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

func createTask(c *gin.Context) {
	var newTask Task //store data
	if err := c.ShouldBindJSON(&newTask); err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"invalid task data"})
		return
	}
	if newTask.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "Task title cannot be empty"})
		return
	}
	newTask.ID = primitive.NewObjectID(); //Create an Object ID of MongoDB

	_, err := taskCollection.InsertOne(context.TODO(), newTask)
	if err!= nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Create Task"})
		return
	}
	c.JSON(http.StatusCreated, newTask)
}

func getTaskByID(c *gin.Context) {
	id := c.Param("id") 
	objectID, err := primitive.ObjectIDFromHex(id)
	if err!= nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var task Task 
	err = taskCollection.FindOne(context.TODO(), bson.M{"_id":objectID}).Decode(&task)
	if err!= nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}
	c.JSON(http.StatusOK,task)
}

func updateTask(c *gin.Context) {
	id := c.Param("id") 
	objectID, err := primitive.ObjectIDFromHex(id)
	if err!= nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}


	var updatedTask Task 
	if err := c.ShouldBindJSON(&updatedTask); err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"Invalid task data"})
		return
	}

	filter := bson.M{"_id": objectID}
	update := bson.M {
		"$set": bson.M{
			"title" : updatedTask.Title,
			"status" : updatedTask.Status,
		},
	}

	_,err = taskCollection.UpdateOne(context.TODO(), filter, update)
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"Failed to update Task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message" : "Task updated successfully!"})

}

func deleteTask(c *gin.Context) {
	id := c.Param("id") 
	objectID, err := primitive.ObjectIDFromHex(id)
	if err!= nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	_,err = taskCollection.DeleteOne(context.TODO(), bson.M{"_id": objectID})
	if err!= nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Faield to delete task"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
	
}
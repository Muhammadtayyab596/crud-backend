const Project = require("../models/project.model");

exports.createProject = async (req, res, next) => {
  const { name, description, image, techstack, githubRepoLink, liveUrl } =
    req.body;

  if (
    !name ||
    !description ||
    !image ||
    !techstack ||
    !githubRepoLink ||
    !liveUrl
  ) {
    return res.status(422).json({
      message: "Please provide all the required fields",
      statusCode: 422,
      status: "error",
    });
  }

  try {
    const project = new Project({
      name,
      description,
      image,
      techstack,
      githubRepoLink,
      liveUrl,
      user: req.user,
    });

    const projectRegister = await project.save();

    if (projectRegister) {
      res.status(201).json({
        message: "Project created successfully",
        statusCode: 201,
        status: "success",
        data: {
          project,
        },
      });
    }
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, startDate, isCompleted, isArchived } = req.query;

    const query = {
      user: userId,
      name: name ? { $regex: new RegExp(name, "i") } : undefined,
      startDate: startDate ? { $gte: new Date(startDate) } : undefined,
      isCompleted: isCompleted !== undefined ? Boolean(isCompleted) : false,
      isArchived: isArchived !== undefined ? Boolean(isArchived) : false,
    };

    Object.keys(query).forEach(
      (key) => query[key] === undefined && delete query[key]
    );

    const projects = await Project.find(query).sort({ startDate: -1 });

    res.status(200).json({
      message: "Projects fetched successfully",
      statusCode: 200,
      status: "success",
      data: {
        projects,
      },
    });
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  const projectId = req.params.id;
  const updatedData = req.body;

  const { name, description, image, techstack, githubRepoLink, liveUrl } =
    req.body;

  if (
    !name ||
    !description ||
    !image ||
    !techstack ||
    !githubRepoLink ||
    !liveUrl
  ) {
    return res.status(422).json({
      message: "Please provide all the required fields",
      statusCode: 422,
      status: "error",
    });
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updatedData,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        message: "Project not found",
        statusCode: 404,
      });
    }

    return res.json({
      message: "Project updated successfully",
      data: updatedProject,
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.completeProject = async (req, res) => {
  const projectId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updatedData,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        message: "Project not found",
        statusCode: 404,
      });
    }

    return res.json({
      message: "Project Complete successfully",
      data: updatedProject,
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.archiveProject = async (req, res) => {
  const projectId = req.params.id;
  const updatedData = req.body;

  try {
    const archiveProjectUpdate = await Project.findByIdAndUpdate(
      projectId,
      updatedData,
      { new: true }
    );

    if (!archiveProjectUpdate) {
      return res.status(404).json({
        message: "Project not found",
        statusCode: 404,
      });
    }

    return res.json({
      message: "Project Archive successfully",
      data: archiveProjectUpdate,
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

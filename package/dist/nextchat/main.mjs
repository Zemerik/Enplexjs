import Resp from "./resp.mjs";
import Analysis from "./analysis.mjs";

/**
 * @class nextchat
 * @description Class to interact with NextChat API for text generation and image analysis.
 */
class nextchat {
  constructor() {
    this.cache = new Map();
  }

  /**
   * @static
   * @async
   * @param {string} prompt - Text prompt for the model.
   * @param {string} options.model - Model to use for text generation ("gemini", "gpt4", etc.).
   * @param {boolean} options.cache (default: false) - Enable caching for responses.
   * @throws {Error} - If prompt or model is missing, or model is invalid.
   * @returns {Promise<string>} - Response object from the API.
   */
  static async ask(prompt, options = {}) {
    if (!prompt) throw new Error("NextChat Error: prompt is required");
    if (!options.model) throw new Error("NextChat Error: model is required");

    const excludedModels = ["flux", "flux-pro"];
    if (excludedModels.includes(options.model)) {
      throw new Error(
        "NextChat Error: flux models are not supported. Use nextchat.imagine() method instead",
      );
    }

    const cacheKey = `${options.model}-${prompt}`;

    if (options.cache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const resp = await Resp(prompt, options.model);

    if (options.cache) {
      this.cache.set(cacheKey, resp);
    }

    return resp;
  }

  /**
   * @static
   * @async
   * @param {string} prompt - Text prompt for image generation.
   * @param {string} model - Model to use for image generation ("flux", "flux-pro").
   * @throws {Error} - If prompt or model is missing, or invalid model for image generation.
   * @returns {Promise<string>} - Image URL generated by the model.
   */
  static async imagine(prompt, model) {
    if (!prompt) throw new Error("NextChat Error: prompt is required");
    if (!["flux", "flux-pro"].includes(model)) {
      throw new Error("NextChat Error: Invalid model for image generation");
    }

    return await Resp(prompt, model);
  }

  /**
   * @static
   * @async
   * @param {string} prompt (default: "") - Text prompt for image analysis.
   * @param {string} url - URL of the image for analysis.
   * @throws {Error} - If url is missing.
   * @returns {Promise<string>} - Text analysis of the image.
   */
  static async ImageAnalysis(prompt = "", url) {
    if (!url) throw new Error("NextChat Error: url is required");

    return await Analysis(prompt, url);
  }
}

export default nextchat;